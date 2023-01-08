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

  // const CONTRACT_ADDRESS = "0x9aCA96ad60a5f4E6118BD0eDFff75717649DF2BC";
  const CONTRACT_ADDRESS = "0xBB668385B9A599Cba24E3e87ca4c3863DbD963F6";
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
    "2004dc7407862933f27e48ae9f2295c1a95acd4acd555a935905cb4d3f1cf215",
    provider
  );

  console.log(signer);
  return signer;
}

function getAlchemyProvider() {
  const network = "goerli";

  const provider = new ethers.providers.AlchemyProvider(
    network,
    "ZH8f9pS0AzbcIdD1YCuuU-yb5bx0KMbo"
  );

  console.log(provider);
  return provider;
}
