const { ethers } = require("ethers");

export async function prepareSupplyChain() {
  // Alchemy Provider
  const provider = getAlchemyProvider();

  // Signer
  const signer = getSigner(provider);

  // Contract Instance
  const supplyChainContract = getContractInstance(signer);

  return [provider, signer, supplyChainContract];
}

function getContractInstance(signer) {
  const contract = require("./SupplyChainManagement.json");

  // const CONTRACT_ADDRESS = "0xBB668385B9A599Cba24E3e87ca4c3863DbD963F6";
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
  const supplyChainContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contract.abi,
    signer
  );

  console.log(supplyChainContract);
  return supplyChainContract;
}

function getSigner(provider) {
  const signer = new ethers.Wallet(
    process.env.PRIVATE_KEY, // METAMASK ACCOUNT PRIVATE KEY
    provider
  );

  console.log(signer);
  return signer;
}

function getAlchemyProvider() {
  const network = "goerli";

  const provider = new ethers.providers.AlchemyProvider(
    network,
    process.env.ALCHEMY_API_KEY
  );

  console.log(provider);
  return provider;
}
