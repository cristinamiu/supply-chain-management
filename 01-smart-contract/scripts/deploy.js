async function main() {
  const SupplyChainContract = await ethers.getContractFactory(
    "SupplyChainManagement"
  );

  const supplyChain = await SupplyChainContract.deploy();

  console.log("Contract deployed to address: ", supplyChain.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
