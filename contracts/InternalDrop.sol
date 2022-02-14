// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";

contract InternalDrop is Ownable {

    mapping(address => uint256) public addressToToken;

    event TokenAssigned(address addr, uint256 tokenId);

    /**
     * @dev Assign a random token to each wallet while upper > 0.
     */
    function assignTokensToWallets(address[] memory _addresses, uint256[] memory _tokenIds) external onlyOwner {

        require(msg.sender == tx.origin, "Can only be called from a wallet");
        require(_addresses.length > 0, "At least one address is needed");
        require(_tokenIds.length > 0, "At least one tokenId is needed");

        uint256[] memory tokensList = new uint256[](_tokenIds.length);
        tokensList = _tokenIds;

        uint256 upper = _tokenIds.length; //Handle new tokensList length

        for (uint i; i < _addresses.length; i++){

            if (upper <= 0) {
                break;
            }

            address addr = _addresses[i];

            if (addressToToken[addr] != 0) {
                continue;
            }

            uint256 tokenIndex = _getRandomNumber(addr, upper);

            uint256 tokenToAssign = tokensList[tokenIndex];

            require(tokenToAssign != 0, "Token cannot be null");

            tokensList[tokenIndex] = tokensList[tokensList.length-1];

            upper--;

            addressToToken[addr] = tokenToAssign;

            emit TokenAssigned(addr, tokenToAssign);
        }
    }

    /**
     * @dev Generates a pseudo-random number.
     */
    function _getRandomNumber(address addr, uint256 _upper) private view returns (uint256) {
        uint256 random = uint256(
            keccak256(
                abi.encodePacked(
                    addr,
                    blockhash(block.number - 1),
                    block.coinbase,
                    block.difficulty
                )
            )
        );

        return random % _upper;
    }

}
