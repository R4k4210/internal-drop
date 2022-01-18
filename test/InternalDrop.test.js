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
        "At least one tokenId is needed"
      );
    });

    it("should fail if addresses length is not greater than 0", async () => {
      const addresses = [];
      const tokens = [1, 2];

      await truffleAssert.fails(
        internalDrop.assignTokensToWallets(addresses, tokens, {
          from: ownerAddress,
        }),
        "At least one address is needed"
      );
    });
  });

  describe("assign", () => {
    it("should each wallet have one token", async () => {
      const addresses = [aliceAddress, bobAddress, ownerAddress];
      const tokens = [100, 101, 102];

      await internalDrop.assignTokensToWallets(addresses, tokens, {
        from: ownerAddress,
      });

      const aliceToken = await internalDrop.addressToToken(aliceAddress);
      const bobToken = await internalDrop.addressToToken(bobAddress);
      const ownerToken = await internalDrop.addressToToken(ownerAddress);

      assert.notStrictEqual(aliceToken.toNumber(), 0);
      assert.notStrictEqual(bobToken.toNumber(), 0);
      assert.notStrictEqual(ownerToken.toNumber(), 0);
    });

    it("should get 0 on the last address", async () => {
      const addresses = [aliceAddress, bobAddress, ownerAddress];
      const tokens = [100, 101];

      await internalDrop.assignTokensToWallets(addresses, tokens, {
        from: ownerAddress,
      });

      const aliceToken = await internalDrop.addressToToken(aliceAddress);
      const bobToken = await internalDrop.addressToToken(bobAddress);
      const ownerToken = await internalDrop.addressToToken(ownerAddress);

      assert.notStrictEqual(aliceToken.toNumber(), 0);
      assert.notStrictEqual(bobToken.toNumber(), 0);
      assert.strictEqual(ownerToken.toNumber(), 0);
    });
  });
});
