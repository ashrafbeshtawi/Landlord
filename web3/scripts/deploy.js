const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Deploy the contract and wait for it
  const LNDTokenFactory = await ethers.getContractFactory("LandLordToken");
  const lndToken = await LNDTokenFactory.deploy(); // Already returns a deployed instance in v6
  await lndToken.waitForDeployment(); // wait explicitly if needed

  console.log("✅ LNDToken deployed to:", await lndToken.getAddress());

  const recipients = [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
  ];

  const amount = ethers.parseUnits("1000", 18); // parseUnits is now a top-level method

  for (const address of recipients) {
    const tx = await lndToken.transfer(address, amount);
    await tx.wait();
    console.log(`💸 Transferred 1000 LND to ${address}`);
  }

  // Profit distribution if your contract supports it
  const distributionAmount = ethers.parseUnits("100", 18);
  const distributeTx = await lndToken.distributeProfit(distributionAmount);
  await distributeTx.wait();
  console.log("🎉 Profit distribution complete, Profit Amount: 100");

  const BACKEND_ADDRESS = '0x2e988A386a799F506693793c6A5AF6B54dfAaBfB';
  const setBackend = await lndToken.setBackendAddress(BACKEND_ADDRESS);
  await setBackend.wait();
  console.log("🎉 Backend Address set to:", BACKEND_ADDRESS);

}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exitCode = 1;
});
