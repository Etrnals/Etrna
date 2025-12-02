// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../uef/UEFRegistry.sol";
import "./IBillionsVerifier.sol";

contract AIRestakedOracle {
    event ResultSubmitted(
        uint256 indexed requestId,
        uint256 indexed uefId,
        bytes32 resultHash,
        address indexed operator,
        bool zkVerified
    );

    struct Request {
        address requester;
        uint256 uefId;
        string prompt;
        bool fulfilled;
        bytes32 resultHash;
    }

    UEFRegistry public immutable uefRegistry;
    IBillionsVerifier public immutable zkVerifier;
    address public operatorRegistry; // address that controls who can submit

    uint256 public nextRequestId;
    mapping(uint256 => Request) public requests;

    modifier onlyOperator() {
        // In production: check an OperatorRegistry contract for restaked status.
        require(msg.sender == operatorRegistry, "NOT_OPERATOR");
        _;
    }

    constructor(UEFRegistry _uefRegistry, IBillionsVerifier _zkVerifier, address _operatorRegistry) {
        uefRegistry = _uefRegistry;
        zkVerifier = _zkVerifier;
        operatorRegistry = _operatorRegistry;
    }

    function requestAI(uint256 uefId, string calldata prompt) external returns (uint256) {
        UEFRegistry.UEF memory u = uefRegistry.uefs(uefId);
        require(u.owner != address(0), "UEF_NOT_FOUND");

        uint256 id = ++nextRequestId;
        requests[id] = Request({
            requester: msg.sender,
            uefId: uefId,
            prompt: prompt,
            fulfilled: false,
            resultHash: bytes32(0)
        });
        return id;
    }

    function submitResult(
        uint256 requestId,
        bytes32 resultHash,
        bytes calldata zkProof
    ) external onlyOperator {
        Request storage r = requests[requestId];
        require(r.requester != address(0), "REQUEST_NOT_FOUND");
        require(!r.fulfilled, "ALREADY_FULFILLED");

        bool ok = zkVerifier.verify(keccak256(abi.encode(requestId, r.uefId, r.prompt, resultHash)), zkProof);
        r.fulfilled = true;
        r.resultHash = resultHash;

        emit ResultSubmitted(requestId, r.uefId, resultHash, msg.sender, ok);
    }
}
