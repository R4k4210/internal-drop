// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";

contract InternalDrop is Ownable {

    mapping(address => uint256) public addressToToken;
    uint256[] tokensList;

    function assignTokensToWallets(address[] memory addresses, uint256[] memory tokenIds) external onlyOwner { 
      require(
          msg.sender == tx.origin,
          "Can only be called from a wallet"
      );

      require(addresses.length > 0, "At least one address is needed");
      require(tokenIds.length > 0, "At least one tokenId is needed");

      tokensList = tokenIds;

      for(uint i=0; i < addresses.length; i++){

        if(tokensList.length == 0) {
          break;
        }

        address addr = addresses[i];

        if(addressToToken[addr] != 0) {
          continue;
        }

        uint256 tokenIndex = _getRandomNumber(tokensList.length);

        uint256 tokenToAssign = tokensList[tokenIndex];

        if(tokensList[tokenIndex] != 0) {
          tokensList[tokenIndex] = tokensList[tokensList.length-1];
        }

        tokensList.pop();

        addressToToken[addr] = tokenToAssign;
      }
    }

    /**
     * @dev Generates a pseudo-random number.
     */
    function _getRandomNumber(uint256 _upper) private view returns (uint256) {
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

        return random % _upper;
    }

}
