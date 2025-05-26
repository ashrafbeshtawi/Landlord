const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Get signers from Hardhat environment (deployer, then 4 users, then backend)
  const [deployer, user1, user2, user3, user4, backend] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  // --- 1. Deploy LandLordToken Contract ---
  const lndToken = await deployContract("LandLordToken");

  // --- 2. Initial Token Distribution to Recipients ---
  console.log("\n--- Initial Token Distribution (1000 LND to each user) ---");
  const initialTransferAmount = ethers.parseUnits("1000", 18); // 1000 tokens
  const recipients = [user1.address, user2.address, user3.address, user4.address];

  for (const address of recipients) {
    await transferTokens(lndToken, address, initialTransferAmount);
  }

  // Log balances after initial distribution
  await logBalance(lndToken, user1.address, "User1");
  await logBalance(lndToken, user2.address, "User2");
  await logBalance(lndToken, user3.address, "User3");
  await logBalance(lndToken, user4.address, "User4");


  // --- 3. First Profit Distribution ---
  const firstDistributionAmount = ethers.parseUnits("100", 18);
  await distributeProfit(lndToken, firstDistributionAmount, "First");

  // --- 4. Second Profit Distribution ---
  const secondDistributionAmount = ethers.parseUnits("250", 18);
  await distributeProfit(lndToken, secondDistributionAmount, "Second");

  // --- 5. Additional Token Transfer to one address ---
  const additionalTransferAmount = ethers.parseUnits("1000", 18);
  const targetAddressForAdditionalTransfer = user1.address; // Send to user1

  await transferTokens(lndToken, targetAddressForAdditionalTransfer, additionalTransferAmount);

  // Log updated balance of user1
  await logBalance(lndToken, user1.address, "User1 (after additional transfer)");
  
  // --- 6. Third Profit Distribution (added as requested) ---
  // The amount is now explicitly set to 100 LND
  const thirdDistributionAmount = ethers.parseUnits("100", 18); 
  await distributeProfit(lndToken, thirdDistributionAmount, "Third");

  // --- 7. Set Backend Address ---
  await setBackendAddress(lndToken, backend.address); // Using the 'backend' signer address

  console.log("\nDeployment and setup script finished.");
}


/**
 * Deploys a contract and returns its instance.
 * @param {string} contractName The name of the contract to deploy.
 * @returns {Promise<ethers.Contract>} The deployed contract instance.
 */
async function deployContract(contractName) {
  console.log(`\n🚀 Deploying ${contractName}...`);
  const ContractFactory = await ethers.getContractFactory(contractName);
  const contractInstance = await ContractFactory.deploy();
  await contractInstance.waitForDeployment();
  const contractAddress = await contractInstance.getAddress();
  console.log(`✅ ${contractName} deployed to: ${contractAddress}`);
  return contractInstance;
}

/**
 * Transfers a specified amount of tokens to a recipient.
 * @param {ethers.Contract} tokenContract The token contract instance.
 * @param {string} recipientAddress The address of the recipient.
 * @param {bigint} amount The amount of tokens to transfer (as BigInt in wei).
 */
async function transferTokens(tokenContract, recipientAddress, amount) {
  const tx = await tokenContract.transfer(recipientAddress, amount);
  await tx.wait();
  console.log(`💸 Transferred ${ethers.formatUnits(amount, 18)} LND to ${recipientAddress}`);
}

/**
 * Initiates a profit distribution.
 * @param {ethers.Contract} tokenContract The token contract instance.
 * @param {bigint} amount The amount of profit to distribute (as BigInt in wei).
 * @param {string} distributionLabel A label for the distribution (e.g., "First", "Second").
 */
async function distributeProfit(tokenContract, amount, distributionLabel) {
  const tx = await tokenContract.distributeProfit(amount);
  await tx.wait();
  console.log(`🎉 ${distributionLabel} Profit Distribution complete, Profit Amount: ${ethers.formatUnits(amount, 18)} LND`);
}

/**
 * Sets the backend address in the contract.
 * @param {ethers.Contract} tokenContract The token contract instance.
 * @param {string} backendAddress The new backend address.
 */
async function setBackendAddress(tokenContract, backendAddress) {
  const tx = await tokenContract.setBackendAddress(backendAddress);
  await tx.wait();
  console.log("🎉 Backend Address set to:", backendAddress);
}

/**
 * Logs the balance of a given address.
 * @param {ethers.Contract} tokenContract The token contract instance.
 * @param {string} address The address whose balance to log.
 * @param {string} label A descriptive label for the address.
 */
async function logBalance(tokenContract, address, label) {
  const balance = await tokenContract.balanceOf(address);
  console.log(`${label} (${address}) balance: ${ethers.formatUnits(balance, 18)} LND`);
}

// Execute the main function
main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exitCode = 1;
});