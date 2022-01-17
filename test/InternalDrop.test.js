const truffleAssert = require("truffle-assertions");
const assert = require("assert");

const InternalDrop = artifacts.require("InternalDrop");

contract("InternalDrop", (accounts) => {
  let internalDrop;
  const ownerAddress = accounts[0];
  const aliceAddress = accounts[1];
  const bobAddress = accounts[2];

  // build up and tear down a new Migration before each test
  beforeEach(async () => {
    internalDrop = await InternalDrop.new();
  });

  describe("onlyOwner", () => {
    it("should fail if caller is not the owner", async () => {
      const addresses = [aliceAddress, bobAddress];
      const tokens = [1, 2];

      await truffleAssert.fails(
        internalDrop.assignTokensToWallets(addresses, tokens, {
          from: aliceAddress,
        })
      );
    });

    it("should fail if tokens length is not greater than 0", async () => {
      const addresses = [aliceAddress, bobAddress];
      const tokens = [];

      await truffleAssert.fails(
        internalDrop.assignTokensToWallets(addresses, tokens, {
          from: ownerAddress,
        }),
        "At leats one tokenId is needed"
      );
    });

    it("should fail if addresses length is not greater than 0", async () => {
      const addresses = [];
      const tokens = [1, 2];

      await truffleAssert.fails(
        internalDrop.assignTokensToWallets(addresses, tokens, {
          from: ownerAddress,
        }),
        "At leats one address is needed"
      );
    });
  });
});
