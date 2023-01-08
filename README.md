# supply-chain-management

## Prerequisites:

- Metamask Account
- Alchemy API Key

## Step 1: Create and deploy the smart contract

### Create .env file with the following:

```
// Alchemy
API_KEY="____API KEY HERE____"
API_URL="https://eth-goerli.g.alchemy.com/v2/____API KEY HERE____"

// Metamask
PRIVATE_KEY=___METAMASK PRIVATE KEY____
```

### Use the following commands:

```
cd 01-smart-contract
```

```
$ npx hardhat run scripts/deploy.js
Compiled 2 Solidity files successfully
Contract deployed to address:  0x4333333c983Ba94d1c3066C48964C11429f22A6D
```

## Step 2: Supply Chain Simulator

### Create a .env.local file:

```
CONTRACT_ADDRESS=___CONTRACT ADDRESS GENERATED FROM PREVIOUS STEP___
PRIVATE_KEY=___METAMASK PRIVATE KEY____
ALCHEMY_API_KEY=___ALCHEMY API KEY___
```

> _Note_
>
> The Metamask private key must be the same one used when the contract was deployed.

### Run app: (localhost:3000)

```
npm run dev
```

## Step 3: Supply Chain Client

### Create a .env.local file:

```
CONTRACT_ADDRESS=___CONTRACT ADDRESS GENERATED FROM STEP 1___
OWNER=___METAMASK PRIVATE KEY____
```

### Run app: (localhost:8080)

```
npm run dev
```
