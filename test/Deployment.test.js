require("truffle-test-utils").init();

const Migrations = artifacts.require("Migrations");

const MAX_DEPLOYED_BYTECODE_SIZE = 24576;

contract("Migrations", (accounts) => {
  let migrations;

  // build up and tear down a new Migrations before each test
  beforeEach(async () => {
    migrations = await Migrations.deployed();
  });

  it("has a validated contract size", async () => {
    // bytecode is in hexadecimal, where each byte is represented by two characters: 0x00 -> 0xff
    let bytecodeSize = migrations.constructor._json.bytecode.length / 2;
    let deployedBytecodeSize =
      migrations.constructor._json.deployedBytecode.length / 2;

    // Make assertion on deployed since the initial transaction takes constructor bytecode into account
    assert(
      deployedBytecodeSize <= MAX_DEPLOYED_BYTECODE_SIZE,
      "Contract bytecode is too big to deploy!"
    );
  });

  it("sets lastCompletedMigration by the owner", async () => {
    let expectedCompleted = 1234;
    await migrations.setCompleted(expectedCompleted, { from: accounts[0] });
    assert.equal(
      expectedCompleted,
      await migrations.last_completed_migration({ from: accounts[0] }),
      "setComplete did not update last_completed_migration"
    );
  });
});
