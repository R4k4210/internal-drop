const HDWalletProvider = require("@truffle/hdwallet-provider");

// environment variables not set in the package config
const fs = require("fs");
const mnemonic = fs.readFileSync("secrets/.mnemonic").toString().trim();
const infuraProjectId = fs.readFileSync("secrets/.infura").toString().trim();

// naive environment assertions, since these aren't present by default
if (!infuraProjectId) {
  throw new Error(
    'truffle-config.js needs the environment variable "INFURA_PROJECT_ID"'
  );
}

if (!mnemonic) {
  throw new Error("truffle-config.js needs the file .mnemonic");
}

if (mnemonic.split(" ").length != 12) {
  throw new Error(
    'The environment variable "MNEMONIC" must be 12 words (space delineated)'
  );
}

// https://truffleframework.com/docs/truffle/reference/configuration
const truffleConfig = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 6500000,
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic,
          },
          providerOrUrl: `https://rinkeby.infura.io/v3/${infuraProjectId}`,
          chainId: 4,
        }),
      network_id: 4,
      gas: 10000000,
      gasPrice: 100000000000,
      confirmations: 2,
      timeoutBlocks: 200,
    },
    mumbai: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic,
          },
          providerOrUrl: `https://polygon-mumbai.infura.io/v3/${infuraProjectId}`,
          chainId: 80001,
        }),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    live: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic,
          },
          providerOrUrl: `https://mainnet.infura.io/v3/${infuraProjectId}`,
          chainId: 1,
        }),
      network_id: 1,
      gas: 9000000,
      gasPrice: 60000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.11",
      settings: {
        optimizer: {
          enabled: true,
          runs: 2000,
        },
      },
    },
  },
  mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions: {
      currency: "USD",
      gasPrice: 2,
    },
  },
  plugins: ["truffle-plugin-verify", "solidity-coverage"],
  api_keys: {
    etherscan: "G5I4SP1FW46BM344RDFQSXMG3W63M9INMQ",
    polygonscan: "MTWAXDK6J8MANQGH7QSPJYJSE5UJPC3XBQ",
  },
};

console.info("\nSetting Truffle Configuration:\n", truffleConfig, "\n");
module.exports = truffleConfig;
