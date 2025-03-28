const hre = require("hardhat");

async function main() {
  // Get the contract factory and deploy the contract.
  const LandLordToken = await hre.ethers.getContractFactory("LandLordToken");
  const landlordToken = await LandLordToken.deploy();
  await landlordToken.waitForDeployment(); // ethers v6 equivalent
  console.log("LandLordToken deployed to:", landlordToken.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
