const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("LandLordToken", function () {
  let LandLordToken, landlordToken;
  let owner, backend, user1, user2, user3, user4; // Renamed user to user1 and added more
  const INITIAL_SUPPLY = ethers.parseUnits("1" + "0".repeat(14), 18);

  // Helper function to convert the ethers Result object (struct return) into a plain JS object
  function normalizeDistributionView(result) {
    if (!result || typeof result !== 'object') {
        return result; // Return as is if not an object or null/undefined
    }
    // Check if it has the expected properties of ProfitDistributionView
    if (
        'totalAmount' in result &&
        'distributionDate' in result &&
        'distributionBlock' in result &&
        'tokensExcludingOwner' in result
    ) {
        return {
            totalAmount: result.totalAmount,
            distributionDate: result.distributionDate,
            distributionBlock: result.distributionBlock,
            tokensExcludingOwner: result.tokensExcludingOwner,
        };
    }
    return result; // Return as is if it doesn't match the struct
  }

  beforeEach(async function () {
    // Adjusted signers to have user1, user2, user3, user4 for this new scenario
    [owner, backend, user1, user2, user3, user4] = await ethers.getSigners();
    LandLordToken = await ethers.getContractFactory("LandLordToken");
    landlordToken = await LandLordToken.deploy();
    await landlordToken.waitForDeployment();

    await landlordToken.connect(owner).setBackendAddress(backend.address);

    // Initial transfers as before (this setup is for existing tests)
    // For the new test case, we'll do specific transfers within the test itself
    await landlordToken.connect(owner).transfer(user1.address, ethers.parseUnits("1000", 18));
    await landlordToken.connect(owner).transfer(user2.address, ethers.parseUnits("2000", 18));
    await landlordToken.connect(owner).transfer(user3.address, ethers.parseUnits("3000", 18));
  });

  describe("Basic Token Functions", function () {
    it("should have correct name, symbol, and decimals", async function () {
      expect(await landlordToken.name()).to.equal("LandLord");
      expect(await landlordToken.symbol()).to.equal("LND");
      expect(await landlordToken.decimals()).to.equal(18);
    });

    it("should have minted the correct initial supply to owner", async function () {
      expect(await landlordToken.totalSupply()).to.equal(INITIAL_SUPPLY);
      const ownerBalance = await landlordToken.balanceOf(owner.address);
      // Owner balance should be initial supply minus transfers to users (from beforeEach)
      const expectedOwnerBalance = INITIAL_SUPPLY -
        ethers.parseUnits("1000", 18) -
        ethers.parseUnits("2000", 18) -
        ethers.parseUnits("3000", 18);
      expect(ownerBalance).to.equal(expectedOwnerBalance);
    });

    it("should allow users to transfer tokens", async function () {
      const transferAmount = ethers.parseUnits("100", 18);
      // Using user1 from now on for consistency in default tests
      await landlordToken.connect(user1).transfer(user2.address, transferAmount);

      expect(await landlordToken.balanceOf(user1.address)).to.equal(ethers.parseUnits("900", 18));
      expect(await landlordToken.balanceOf(user2.address)).to.equal(ethers.parseUnits("2100", 18));
    });

    it("should allow users to burn tokens", async function () {
      const burnAmount = ethers.parseUnits("100", 18);
      const initialBalance = await landlordToken.balanceOf(user1.address);
      const initialSupply = await landlordToken.totalSupply();

      await landlordToken.connect(user1).burn(burnAmount);

      expect(await landlordToken.balanceOf(user1.address)).to.equal(initialBalance - burnAmount);
      expect(await landlordToken.totalSupply()).to.equal(initialSupply - burnAmount);
    });
  });

  describe("Backend Address Management", function () {
    it("should correctly set the backend address on deployment", async function () {
      expect(await landlordToken.backendAddress()).to.equal(backend.address);
    });

    it("should allow owner to update the backend address", async function () {
      await landlordToken.connect(owner).setBackendAddress(user4.address); // Using user4
      expect(await landlordToken.backendAddress()).to.equal(user4.address);
    });

    it("should not allow non-owners to update the backend address", async function () {
      await expect(
        landlordToken.connect(user1).setBackendAddress(user2.address)
      ).to.be.reverted; // With AccessControl error
    });

    it("should not allow setting the backend address to zero address", async function () {
      await expect(
        landlordToken.connect(owner).setBackendAddress(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid backend address");
    });
  });

  describe("Profit Distribution", function () {
    // ... existing tests for profit distribution ...

    it("should correctly set tokensExcludingOwner when distributing profit after transfers to multiple wallets", async function () {
      // Create a fresh state for this specific test scenario
      LandLordToken = await ethers.getContractFactory("LandLordToken");
      landlordToken = await LandLordToken.deploy();
      await landlordToken.waitForDeployment();
      await landlordToken.connect(owner).setBackendAddress(backend.address);

      const transferAmount = ethers.parseUnits("100", 18);

      // Admin sends 100 tokens to 4 different wallets
      await landlordToken.connect(owner).transfer(user1.address, transferAmount);
      await landlordToken.connect(owner).transfer(user2.address, transferAmount);
      await landlordToken.connect(owner).transfer(user3.address, transferAmount);
      await landlordToken.connect(owner).transfer(user4.address, transferAmount);

      // Verify balances
      expect(await landlordToken.balanceOf(user1.address)).to.equal(transferAmount);
      expect(await landlordToken.balanceOf(user2.address)).to.equal(transferAmount);
      expect(await landlordToken.balanceOf(user3.address)).to.equal(transferAmount);
      expect(await landlordToken.balanceOf(user4.address)).to.equal(transferAmount);

      // Admin distributes 100 tokens as profit
      const profitAmount = ethers.parseUnits("100", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount);

      // Check that tokensExcludingOwner is correctly set as 400
      const distributionId = 0; // This should be the first distribution in this fresh instance
      const distributionDetails = await landlordToken.getDistribution(distributionId);

      const expectedTokensExcludingOwner = ethers.parseUnits("400", 18); // 4 users * 100 tokens each
      expect(distributionDetails.tokensExcludingOwner).to.equal(expectedTokensExcludingOwner);
      expect(distributionDetails.totalAmount).to.equal(profitAmount);
    });

    it("should distribute profit and allow user to claim profit with valid signature", async function () {
      // Owner calls distributeProfit with a profit amount (e.g., 500 tokens)
      const profitAmount = ethers.parseUnits("500", 18);
      const tx = await landlordToken.connect(owner).distributeProfit(profitAmount);
      await tx.wait();

      // Distribution ID should be 0 (first distribution)
      const distributionId = 0;

      // User's balance at distribution time (should be 1000 tokens from beforeEach setup)
      const balanceAtDistribution = await landlordToken.balanceOf(user1.address);

      // Prepare the message hash using solidityPackedKeccak256
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user1.address, distributionId, balanceAtDistribution]
      );

      // Convert the message hash to bytes
      const messageHashBytes = ethers.getBytes(messageHash);

      // Backend (designated signer) signs the message hash
      const signature = await backend.signMessage(messageHashBytes);

      // Get the distribution details using the new struct return type
      const distributionDetails = await landlordToken.getDistribution(distributionId);

      // Calculate expected profit exactly as the contract does
      // Use the stored tokensExcludingOwner value from the contract
      const expectedProfit = (distributionDetails.totalAmount * balanceAtDistribution) / distributionDetails.tokensExcludingOwner;

      // User claims the profit using the generated signature
      const userBalanceBefore = await landlordToken.balanceOf(user1.address);
      const claimTx = await landlordToken
        .connect(user1)
        .claimProfit(distributionId, balanceAtDistribution, signature);
      await claimTx.wait();

      // Check that user's balance increased by the profit amount
      const finalUserBalance = await landlordToken.balanceOf(user1.address);
      expect(finalUserBalance).to.equal(userBalanceBefore + expectedProfit);
    });

    it("should not allow a claim with an invalid signature", async function () {
      const profitAmount = ethers.parseUnits("500", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount);
      const distributionId = 0;
      const balanceAtDistribution = await landlordToken.balanceOf(user1.address);

      // Create a signature with another signer (user2) using solidityPackedKeccak256
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user1.address, distributionId, balanceAtDistribution]
      );
      const messageHashBytes = ethers.getBytes(messageHash);
      const invalidSignature = await user2.signMessage(messageHashBytes);

      // Expect the claim to revert due to invalid signature
      await expect(
        landlordToken
          .connect(user1)
          .claimProfit(distributionId, balanceAtDistribution, invalidSignature)
      ).to.be.revertedWith("Invalid backend signature");
    });

    it("should prevent a user from claiming profit twice for the same distribution", async function () {
      // Distribute profit
      const profitAmount = ethers.parseUnits("500", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount);
      const distributionId = 0;

      // Get user's balance at distribution
      const balanceAtDistribution = await landlordToken.balanceOf(user1.address);

      // Prepare message hash
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user1.address, distributionId, balanceAtDistribution]
      );
      const messageHashBytes = ethers.getBytes(messageHash);

      // Backend signs the message
      const signature = await backend.signMessage(messageHashBytes);

      // First claim should succeed
      await landlordToken.connect(user1).claimProfit(distributionId, balanceAtDistribution, signature);

      // Second claim should revert
      await expect(
        landlordToken.connect(user1).claimProfit(distributionId, balanceAtDistribution, signature)
      ).to.be.revertedWith("Already claimed for this distribution");
    });

    it("should allow different users to claim for the same distribution", async function () {
      // Distribute profit
      const profitAmount = ethers.parseUnits("1000", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount);
      const distributionId = 0;

      // Get distribution details using the new struct return type
      const distributionDetails = await landlordToken.getDistribution(distributionId);

      // Claim for user1
      const user1BalanceAtDistribution = await landlordToken.balanceOf(user1.address);
      const user1MessageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user1.address, distributionId, user1BalanceAtDistribution]
      );
      const user1MessageHashBytes = ethers.getBytes(user1MessageHash);
      const user1Signature = await backend.signMessage(user1MessageHashBytes);

      // Claim for user2
      const user2BalanceAtDistribution = await landlordToken.balanceOf(user2.address);
      const user2MessageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user2.address, distributionId, user2BalanceAtDistribution]
      );
      const user2MessageHashBytes = ethers.getBytes(user2MessageHash);
      const user2Signature = await backend.signMessage(user2MessageHashBytes);

      // Calculate expected profits using the exact same division as the contract
      const expectedUser1Profit = (distributionDetails.totalAmount * user1BalanceAtDistribution) / distributionDetails.tokensExcludingOwner;
      const expectedUser2Profit = (distributionDetails.totalAmount * user2BalanceAtDistribution) / distributionDetails.tokensExcludingOwner;

      // Both users should be able to claim
      const user1BalanceBefore = await landlordToken.balanceOf(user1.address);
      await landlordToken.connect(user1).claimProfit(distributionId, user1BalanceAtDistribution, user1Signature);

      const user2BalanceBefore = await landlordToken.balanceOf(user2.address);
      await landlordToken.connect(user2).claimProfit(distributionId, user2BalanceAtDistribution, user2Signature);

      // Verify balances increased correctly
      const finalUser1Balance = await landlordToken.balanceOf(user1.address);
      const finalUser2Balance = await landlordToken.balanceOf(user2.address);

      expect(finalUser1Balance).to.equal(user1BalanceBefore + expectedUser1Profit);
      expect(finalUser2Balance).to.equal(user2BalanceBefore + expectedUser2Profit);
    });

    it("should prevent owner from claiming profit", async function () {
      // Distribute profit
      const profitAmount = ethers.parseUnits("500", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount);
      const distributionId = 0;

      // Prepare message hash for owner
      const ownerBalanceAtDistribution = await landlordToken.balanceOf(owner.address);
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [owner.address, distributionId, ownerBalanceAtDistribution]
      );
      const messageHashBytes = ethers.getBytes(messageHash);

      // Backend signs the message
      const signature = await backend.signMessage(messageHashBytes);

      // Attempt to claim by owner should revert
      await expect(
        landlordToken.connect(owner).claimProfit(distributionId, ownerBalanceAtDistribution, signature)
      ).to.be.revertedWith("Owner cannot claim");
    });

    it("should not allow claiming from non-existent distribution", async function () {
      const nonExistentDistributionId = 999;
      const user1BalanceAtDistribution = await landlordToken.balanceOf(user1.address);

      // Prepare message hash
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user1.address, nonExistentDistributionId, user1BalanceAtDistribution]
      );
      const messageHashBytes = ethers.getBytes(messageHash);
      const signature = await backend.signMessage(messageHashBytes);

      // Attempt to claim from non-existent distribution should revert
      await expect(
        landlordToken.connect(user1).claimProfit(nonExistentDistributionId, user1BalanceAtDistribution, signature)
      ).to.be.revertedWith("Distribution does not exist");
    });

    it("should allow multiple profit distributions over time", async function () {
      // First distribution
      const profitAmount1 = ethers.parseUnits("500", 18);
      const tx1 = await landlordToken.connect(owner).distributeProfit(profitAmount1);
      const receipt1 = await tx1.wait();
      const block1 = await ethers.provider.getBlock(receipt1.blockNumber);
      const distDate1 = block1.timestamp; // Get actual timestamp from block

      // Second distribution after some time
      await time.increase(86400); // 1 day later
      const profitAmount2 = ethers.parseUnits("1000", 18);
      const tx2 = await landlordToken.connect(owner).distributeProfit(profitAmount2);
      const receipt2 = await tx2.wait();
      const block2 = await ethers.provider.getBlock(receipt2.blockNumber);
      const distDate2 = block2.timestamp; // Get actual timestamp from block


      // Get distribution details for exact calculations using the new struct return type
      const distributionDetails1 = await landlordToken.getDistribution(0);
      const distributionDetails2 = await landlordToken.getDistribution(1);

      // User1 claims from first distribution
      const distributionId1 = 0;
      const user1BalanceAtDistribution1 = ethers.parseUnits("1000", 18); // Initial balance

      const messageHash1 = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user1.address, distributionId1, user1BalanceAtDistribution1]
      );
      const messageHashBytes1 = ethers.getBytes(messageHash1);
      const signature1 = await backend.signMessage(messageHashBytes1);

      const user1BalanceBefore1 = await landlordToken.balanceOf(user1.address);
      await landlordToken.connect(user1).claimProfit(distributionId1, user1BalanceAtDistribution1, signature1);
      const user1BalanceAfter1 = await landlordToken.balanceOf(user1.address);

      const expectedProfit1 = (distributionDetails1.totalAmount * user1BalanceAtDistribution1) / distributionDetails1.tokensExcludingOwner;
      expect(user1BalanceAfter1).to.equal(user1BalanceBefore1 + expectedProfit1);

      // User1 claims from second distribution
      const distributionId2 = 1;
      const user1BalanceAtDistribution2_current = await landlordToken.balanceOf(user1.address);

      const messageHash2 = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user1.address, distributionId2, user1BalanceAtDistribution2_current]
      );
      const messageHashBytes2 = ethers.getBytes(messageHash2);
      const signature2 = await backend.signMessage(messageHashBytes2);

      const user1BalanceBefore2 = await landlordToken.balanceOf(user1.address);
      await landlordToken.connect(user1).claimProfit(distributionId2, user1BalanceAtDistribution2_current, signature2);
      const user1BalanceAfter2 = await landlordToken.balanceOf(user1.address);

      const expectedProfit2 = (distributionDetails2.totalAmount * user1BalanceAtDistribution2_current) / distributionDetails2.tokensExcludingOwner;
      expect(user1BalanceAfter2).to.equal(user1BalanceBefore2 + expectedProfit2);

      // Verify distributions were recorded correctly
      expect(distributionDetails1.totalAmount).to.equal(profitAmount1);
      expect(distributionDetails2.totalAmount).to.equal(profitAmount2);
      // Check block and date, ensuring they are BigInt and comparing
      expect(distributionDetails1.distributionDate).to.equal(BigInt(distDate1));
      expect(distributionDetails2.distributionDate).to.equal(BigInt(distDate2));
      expect(distributionDetails1.distributionBlock).to.equal(BigInt(receipt1.blockNumber));
      expect(distributionDetails2.distributionBlock).to.equal(BigInt(receipt2.blockNumber));
    });

    it("should correctly check if a user has claimed", async function () {
      // Distribute profit
      const profitAmount = ethers.parseUnits("500", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount);
      const distributionId = 0;

      // Initially user1 should not have claimed
      expect(await landlordToken.hasClaimed(distributionId, user1.address)).to.be.false;

      // User1 claims profit
      const user1BalanceAtDistribution = await landlordToken.balanceOf(user1.address);
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user1.address, distributionId, user1BalanceAtDistribution]
      );
      const messageHashBytes = ethers.getBytes(messageHash);
      const signature = await backend.signMessage(messageHashBytes);

      await landlordToken.connect(user1).claimProfit(distributionId, user1BalanceAtDistribution, signature);

      // After claiming, hasClaimed should return true
      expect(await landlordToken.hasClaimed(distributionId, user1.address)).to.be.true;

      // Should still be false for a different user
      expect(await landlordToken.hasClaimed(distributionId, user2.address)).to.be.false;
    });
  });

  describe("Token Generation", function () {
    it("should allow owner to generate new tokens within limits", async function () {
      const initialSupply = await landlordToken.totalSupply();
      const maxMintAmount = initialSupply / BigInt(10); // 10% of total supply

      await landlordToken.connect(owner).generateTokensForRealEstatePurchase(maxMintAmount);

      const newSupply = await landlordToken.totalSupply();
      expect(newSupply).to.equal(initialSupply + maxMintAmount);
    });

    it("should not allow generating tokens beyond 10% of supply", async function () {
      const initialSupply = await landlordToken.totalSupply();
      const excessiveAmount = (initialSupply / BigInt(10)) + BigInt(1); // 10% + 1

      await expect(
        landlordToken.connect(owner).generateTokensForRealEstatePurchase(excessiveAmount)
      ).to.be.revertedWith("Minting amount exceeds 10% of total supply");
    });

    it("should not allow non-owners to generate new tokens", async function () {
      const mintAmount = ethers.parseUnits("1000", 18);

      await expect(
        landlordToken.connect(user1).generateTokensForRealEstatePurchase(mintAmount)
      ).to.be.reverted; // With AccessControl error
    });

    it("should correctly update total supply and owner balance after minting new tokens", async function () {
      const initialSupply = await landlordToken.totalSupply();
      const initialOwnerBalance = await landlordToken.balanceOf(owner.address);

      const amountToMint = ethers.parseUnits("5000", 18); // Example amount to mint

      // Ensure the amount is within the 10% limit for this test
      const maxMintAmount = initialSupply / BigInt(10);
      expect(amountToMint).to.be.lte(maxMintAmount, "Test amount exceeds max mint limit for this test setup.");

      // Mint new tokens as the owner
      await landlordToken.connect(owner).generateTokensForRealEstatePurchase(amountToMint);

      const newSupply = await landlordToken.totalSupply();
      const newOwnerBalance = await landlordToken.balanceOf(owner.address);

      // Verify total supply increased correctly
      expect(newSupply).to.equal(initialSupply + amountToMint);

      // Verify owner's balance increased correctly
      expect(newOwnerBalance).to.equal(initialOwnerBalance + amountToMint);
    });
  });

  describe("Edge Cases", function () {
    it("should not allow profit distribution of zero amount", async function () {
      await expect(
        landlordToken.connect(owner).distributeProfit(0)
      ).to.be.revertedWith("Number of Tokens must be bigger than 0");
    });

    it("should not distribute if there are no eligible holders", async function () {
      // Create a new token where owner holds 100% of supply
      const newToken = await LandLordToken.deploy();
      await newToken.waitForDeployment();

      // Try to distribute profit
      const profitAmount = ethers.parseUnits("500", 18);
      await expect(
        newToken.connect(owner).distributeProfit(profitAmount)
      ).to.be.revertedWith("No eligible holders for distribution");
    });

    it("should handle correct profit distribution when supply changes", async function () {
      // Distribute initial profit
      const profitAmount = ethers.parseUnits("1000", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount);
      const distributionId = 0;

      // Get distribution details using the new struct return type
      const distributionDetails = await landlordToken.getDistribution(distributionId);

      // Burn some tokens to change total supply
      const burnAmount = ethers.parseUnits("500", 18);
      await landlordToken.connect(user1).burn(burnAmount);

      // Generate new tokens for owner
      const mintAmount = ethers.parseUnits("50", 18);
      await landlordToken.connect(owner).generateTokensForRealEstatePurchase(mintAmount);

      // Check that user1 can still claim their correct profit
      const user1BalanceAtDistribution = ethers.parseUnits("1000", 18); // Original balance
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user1.address, distributionId, user1BalanceAtDistribution]
      );
      const messageHashBytes = ethers.getBytes(messageHash);
      const signature = await backend.signMessage(messageHashBytes);

      const user1BalanceBefore = await landlordToken.balanceOf(user1.address);
      await landlordToken.connect(user1).claimProfit(distributionId, user1BalanceAtDistribution, signature);
      const user1BalanceAfter = await landlordToken.balanceOf(user1.address);

      // Calculate expected profit using the exact contract's division
      const expectedProfit = (distributionDetails.totalAmount * user1BalanceAtDistribution) / distributionDetails.tokensExcludingOwner;
      expect(user1BalanceAfter).to.equal(user1BalanceBefore + expectedProfit);

      // Check that distribution details match expected
      expect(distributionDetails.totalAmount).to.equal(profitAmount);

      // Total supply - owner balance at distribution time should be tokensExcludingOwner
      const initialTransfers = ethers.parseUnits("6000", 18); // 1000 + 2000 + 3000
      expect(distributionDetails.tokensExcludingOwner).to.equal(initialTransfers);
    });

    it("should accept claims with incorrect balance if signed from Backend", async function () {
      // Distribute profit
      const profitAmount = ethers.parseUnits("500", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount);
      const distributionId = 0;

      // Get distribution details using the new struct return type
      const distributionDetails = await landlordToken.getDistribution(distributionId);

      // Actual balance is 1000, but prepare signature for fake balance of 2000
      const fakeBalance = ethers.parseUnits("2000", 18);
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user1.address, distributionId, fakeBalance]
      );
      const messageHashBytes = ethers.getBytes(messageHash);
      const signature = await backend.signMessage(messageHashBytes);

      // Get user1 balance before claiming
      const user1BalanceBefore = await landlordToken.balanceOf(user1.address);

      // Try to claim with the fake balance (should work since backend signed it)
      await landlordToken.connect(user1).claimProfit(distributionId, fakeBalance, signature);

      // Calculate expected profit exactly as the contract does
      const expectedProfit = (distributionDetails.totalAmount * fakeBalance) / distributionDetails.tokensExcludingOwner;

      // Verify user1 received the profit based on the fake balance
      const finalUser1Balance = await landlordToken.balanceOf(user1.address);
      expect(finalUser1Balance).to.equal(user1BalanceBefore + expectedProfit);
    });
  });

  describe("getUnclaimedDistributions", function () {
    // Helper function to get expected ProfitDistributionView objects for comparison
    async function getExpectedDistributionView(id) {
      const details = await landlordToken.getDistribution(id);
      // Use the normalize helper to ensure it's a plain object for deep.equal
      return normalizeDistributionView(details);
    }

    it("should return an empty array if no distributions exist", async function () {
      const unclaimed = await landlordToken.getUnclaimedDistributions(user1.address);
      // Normalize the returned array for comparison
      const normalizedUnclaimed = unclaimed.map(normalizeDistributionView);
      expect(normalizedUnclaimed).to.deep.equal([]);
    });

    it("should return an empty array if user has claimed all distributions", async function () {
      // Distribute profit
      const profitAmount1 = ethers.parseUnits("100", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount1); // id 0
      const profitAmount2 = ethers.parseUnits("200", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount2); // id 1

      // Claim both distributions for user1
      for (let i = 0; i < 2; i++) {
        const balanceAtDistribution = await landlordToken.balanceOf(user1.address);
        const messageHash = ethers.solidityPackedKeccak256(
          ["address", "uint256", "uint256"],
          [user1.address, i, balanceAtDistribution]
        );
        const messageHashBytes = ethers.getBytes(messageHash);
        const signature = await backend.signMessage(messageHashBytes);
        await landlordToken.connect(user1).claimProfit(i, balanceAtDistribution, signature);
      }

      const unclaimed = await landlordToken.getUnclaimedDistributions(user1.address);
      const normalizedUnclaimed = unclaimed.map(normalizeDistributionView);
      expect(normalizedUnclaimed).to.deep.equal([]);
    });

    it("should return correct unclaimed distributions when some are claimed", async function () {
      // Distribute multiple profits
      const profitAmount1 = ethers.parseUnits("100", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount1); // id 0
      const profitAmount2 = ethers.parseUnits("200", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount2); // id 1
      const profitAmount3 = ethers.parseUnits("300", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount3); // id 2

      // Claim distribution 0 and 2 for user1
      const distributionsToClaim = [0, 2];
      for (const id of distributionsToClaim) {
        const balanceAtDistribution = await landlordToken.balanceOf(user1.address);
        const messageHash = ethers.solidityPackedKeccak256(
          ["address", "uint256", "uint256"],
          [user1.address, id, balanceAtDistribution]
        );
        const messageHashBytes = ethers.getBytes(messageHash);
        const signature = await backend.signMessage(messageHashBytes);
        await landlordToken.connect(user1).claimProfit(id, balanceAtDistribution, signature);
      }

      const unclaimed = await landlordToken.getUnclaimedDistributions(user1.address);
      const normalizedUnclaimed = unclaimed.map(normalizeDistributionView);
      
      // Expected array now contains ProfitDistributionView objects
      const expectedUnclaimed = [
        await getExpectedDistributionView(1) // Only distribution 1 should be unclaimed
      ];
      expect(normalizedUnclaimed).to.deep.equal(expectedUnclaimed);
    });

    it("should return all distributions if none have been claimed by the user", async function () {
      // Distribute multiple profits
      await landlordToken.connect(owner).distributeProfit(ethers.parseUnits("100", 18)); // id 0
      await landlordToken.connect(owner).distributeProfit(ethers.parseUnits("200", 18)); // id 1
      await landlordToken.connect(owner).distributeProfit(ethers.parseUnits("300", 18)); // id 2

      const unclaimed = await landlordToken.getUnclaimedDistributions(user1.address);
      const normalizedUnclaimed = unclaimed.map(normalizeDistributionView);

      // Expected array contains ProfitDistributionView objects for all distributions
      const expectedUnclaimed = [
        await getExpectedDistributionView(0),
        await getExpectedDistributionView(1),
        await getExpectedDistributionView(2)
      ];
      expect(normalizedUnclaimed).to.deep.equal(expectedUnclaimed);
    });

    it("should return different unclaimed distributions for different users", async function () {
      // Distribute multiple profits
      await landlordToken.connect(owner).distributeProfit(ethers.parseUnits("100", 18)); // id 0
      await landlordToken.connect(owner).distributeProfit(ethers.parseUnits("200", 18)); // id 1
      await landlordToken.connect(owner).distributeProfit(ethers.parseUnits("300", 18)); // id 2

      // Get expected distribution views once, to reuse
      const dist0View = await getExpectedDistributionView(0);
      const dist1View = await getExpectedDistributionView(1);
      const dist2View = await getExpectedDistributionView(2);

      // User1 claims distribution 0
      const user1BalanceAtDistribution0 = await landlordToken.balanceOf(user1.address);
      const user1MessageHash0 = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user1.address, 0, user1BalanceAtDistribution0]
      );
      const user1MessageHashBytes0 = ethers.getBytes(user1MessageHash0);
      const user1Signature0 = await backend.signMessage(user1MessageHashBytes0);
      await landlordToken.connect(user1).claimProfit(0, user1BalanceAtDistribution0, user1Signature0);

      // User2 claims distribution 1
      const user2BalanceAtDistribution1 = await landlordToken.balanceOf(user2.address);
      const user2MessageHash1 = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user2.address, 1, user2BalanceAtDistribution1]
      );
      const user2MessageHashBytes1 = ethers.getBytes(user2MessageHash1);
      const user2Signature1 = await backend.signMessage(user2MessageHashBytes1);
      await landlordToken.connect(user2).claimProfit(1, user2BalanceAtDistribution1, user2Signature1);

      // Check unclaimed for user1
      const user1Unclaimed = await landlordToken.getUnclaimedDistributions(user1.address);
      const normalizedUser1Unclaimed = user1Unclaimed.map(normalizeDistributionView);
      expect(normalizedUser1Unclaimed).to.deep.equal([dist1View, dist2View]);

      // Check unclaimed for user2
      const user2Unclaimed = await landlordToken.getUnclaimedDistributions(user2.address);
      const normalizedUser2Unclaimed = user2Unclaimed.map(normalizeDistributionView);
      expect(normalizedUser2Unclaimed).to.deep.equal([dist0View, dist2View]);

      // Check unclaimed for user3 (claimed none)
      const user3Unclaimed = await landlordToken.getUnclaimedDistributions(user3.address);
      const normalizedUser3Unclaimed = user3Unclaimed.map(normalizeDistributionView);
      expect(normalizedUser3Unclaimed).to.deep.equal([dist0View, dist1View, dist2View]);
    });
  });
});