# smart-contract-skeleton

## Software used

[Truffle](https://www.trufflesuite.com/docs/truffle/overview)

[Ganache](https://www.trufflesuite.com/docs/ganache/overview)

## Setup

Generate a mnemonic and save it into `secrets/.mnemonic`. This mnemonic can be used to import the wallet on Metamask. This wallet will be the owner of any
smart contract deployed with this project. DO NOT PUSH THE .mnemonic FILE INTO THE REPOSITORY.

To genereate an automatic `.mnemonic` file and mnemonic phrase run the following command.
`./node_modules/.bin/mnemonics > secrets/.mnemonic`

Create a project in [Infura](https://infura.io/) and save the project id into `secrets/.infura`.

## Run

To start an empty node locally and execute all the contract migrations on it run:

`yarn run start`

The node will be listening locally in the port `8545`

### Fork

By having a fork we will be able to access all the hashes that were written in the forked network until the moment that the fork was created. This can be helpful when trying to do test with data that lives in another network.

To create a fork of a network locally and execute all the contract migrations on it run:

`yarn run start:rinkeby`

Available networks to test:

```
Kovan
Rinkeby
Ropsten
```

Note: Check the scripts in `package.json` for other commands.

### Validate

Test that the local node is up and running

```
curl http://127.0.0.1:8545 \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc": "2.0", "method": "web3_clientVersion"}'
```

## Tests and Linting

`yarn run lint:sol`

`yarn run test`

## Verify smart contract on Etherscan

`yarn verify:rinkeby`

`yarn verify:live`

## Deploy

`yarn migrate:rinkeby` to deploy on Rinkeby. The wallet set on .mnemonic should have enough Rinkeby Ether

`yarn migrate:live` to deploy on Mainnet. The wallet set on .mnemonic should have enough Ether
