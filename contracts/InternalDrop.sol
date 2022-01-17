// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";

contract InternalDrop is Ownable {

    mapping(address => uint8) public addressToToken;
    uint8[] tokensList;

    function assignTokensToWallets(address[] memory addresses, uint8[] memory tokenIds) external onlyOwner { 
      require(
          msg.sender == tx.origin,
          "Can only be called from a wallet"
      );

      require(addresses.length > 0, "At least one address is needed");
      require(tokenIds.length > 0, "At leats one tokenId is needed");

      tokensList = tokenIds;

      for(uint8 i=0; i < addresses.length; i++){
        if(!(tokensList.length > 0)) {
          break;
        }

        uint256 tokenIndex = _getRandomNumber(tokensList.length);

        uint8 tokenToAssing = tokensList[tokenIndex];
        tokensList[tokenIndex] = tokensList[tokensList.length-1];
        tokensList.pop();

        addressToToken[addresses[i]] = tokenToAssing;
      }
    }

    /**
     * @dev Generates a pseudo-random number.
     */
    function _getRandomNumber(uint256 length) private view returns (uint256) {
        uint256 random = uint256(
            keccak256(
                abi.encodePacked(
                    blockhash(block.number - 1),
                    block.coinbase,
                    block.difficulty,
                    msg.sender
                )
            )
        );

        uint res = random % length;
        return res;
    }
    
}
