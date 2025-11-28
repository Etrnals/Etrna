// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IBillionsVerifier {
    /// @notice Verifies a zk-proof (opaque bytes) for a given statement hash.
    function verify(bytes32 statementHash, bytes calldata proof) external view returns (bool);
}
