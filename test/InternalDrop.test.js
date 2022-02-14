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
        }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it("should fail if tokens length is not greater than 0", async () => {
      const addresses = [aliceAddress, bobAddress];
      const tokens = [];

      await truffleAssert.fails(
        internalDrop.assignTokensToWallets(addresses, tokens, {
          from: ownerAddress,
        }),
        truffleAssert.ErrorType.REVERT,
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
        truffleAssert.ErrorType.REVERT,
        "At least one address is needed"
      );
    });
  });

  describe("assign", () => {
    it("should have one token per wallet", async () => {
      const addresses = [aliceAddress, bobAddress, ownerAddress];
      const tokens = [100, 101, 102];

      await internalDrop.assignTokensToWallets(addresses, tokens, {
        from: ownerAddress,
      });

      const aliceToken = await internalDrop.addressToToken(aliceAddress);
      const bobToken = await internalDrop.addressToToken(bobAddress);
      const ownerToken = await internalDrop.addressToToken(ownerAddress);

      console.log("==========================================");
      console.log("ALICE", aliceToken.toNumber());
      console.log("BOB", bobToken.toNumber());
      console.log("OWNER", ownerToken.toNumber());
      console.log("==========================================");

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

      console.log("==========================================");
      console.log("ALICE", aliceToken.toNumber());
      console.log("BOB", bobToken.toNumber());
      console.log("OWNER", ownerToken.toNumber());
      console.log("==========================================");

      assert.notStrictEqual(aliceToken.toNumber(), 0);
      assert.notStrictEqual(bobToken.toNumber(), 0);
      assert.strictEqual(ownerToken.toNumber(), 0);
    });

    it("should fail if token is null", async () => {
      const addresses = [aliceAddress, bobAddress, ownerAddress];
      const tokens = [100, 0, 102];

      await truffleAssert.fails(
        internalDrop.assignTokensToWallets(addresses, tokens, {
          from: ownerAddress,
        }),

        truffleAssert.ErrorType.REVERT,
        "Token cannot be null"
      );

      const aliceToken = await internalDrop.addressToToken(aliceAddress);
      const bobToken = await internalDrop.addressToToken(bobAddress);
      const ownerToken = await internalDrop.addressToToken(ownerAddress);

      console.log("==========================================");
      console.log("ALICE", aliceToken.toNumber());
      console.log("BOB", bobToken.toNumber());
      console.log("OWNER", ownerToken.toNumber());
      console.log("==========================================");
    });
  });
});
