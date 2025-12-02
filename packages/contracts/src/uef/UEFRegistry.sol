// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract UEFRegistry {
    event UEFRegistered(uint256 indexed uefId, address indexed owner, string uri, bytes32 contentHash);
    event UEFUpdated(uint256 indexed uefId, string uri, bytes32 contentHash);

    struct UEF {
        address owner;
        string uri;
        bytes32 contentHash;
    }

    uint256 public nextUefId;
    mapping(uint256 => UEF) public uefs;

    function registerUEF(string calldata uri, bytes32 contentHash) external returns (uint256) {
        uint256 id = ++nextUefId;
        uefs[id] = UEF({owner: msg.sender, uri: uri, contentHash: contentHash});
        emit UEFRegistered(id, msg.sender, uri, contentHash);
        return id;
    }

    function updateUEF(uint256 uefId, string calldata uri, bytes32 contentHash) external {
        UEF storage u = uefs[uefId];
        require(u.owner == msg.sender, "NOT_OWNER");
        u.uri = uri;
        u.contentHash = contentHash;
        emit UEFUpdated(uefId, uri, contentHash);
    }
}
