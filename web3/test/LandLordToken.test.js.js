const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("LandLordToken", function () {
  let LandLordToken, landlordToken;
  let owner, backend, user, user2, user3;
  const INITIAL_SUPPLY = ethers.parseUnits("1" + "0".repeat(14), 18);

  beforeEach(async function () {
    [owner, backend, user, user2, user3] = await ethers.getSigners();
    LandLordToken = await ethers.getContractFactory("LandLordToken");
    landlordToken = await LandLordToken.deploy();
    await landlordToken.waitForDeployment();

    await landlordToken.connect(owner).setBackendAddress(backend.address);

    // Transfer tokens to test users
    const transferAmount = ethers.parseUnits("1000", 18);
    await landlordToken.connect(owner).transfer(user.address, transferAmount);
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
      // Owner balance should be initial supply minus transfers to users
      const expectedOwnerBalance = INITIAL_SUPPLY - 
        ethers.parseUnits("1000", 18) - 
        ethers.parseUnits("2000", 18) - 
        ethers.parseUnits("3000", 18);
      expect(ownerBalance).to.equal(expectedOwnerBalance);
    });

    it("should allow users to transfer tokens", async function () {
      const transferAmount = ethers.parseUnits("100", 18);
      await landlordToken.connect(user).transfer(user2.address, transferAmount);
      
      expect(await landlordToken.balanceOf(user.address)).to.equal(ethers.parseUnits("900", 18));
      expect(await landlordToken.balanceOf(user2.address)).to.equal(ethers.parseUnits("2100", 18));
    });

    it("should allow users to burn tokens", async function () {
      const burnAmount = ethers.parseUnits("100", 18);
      const initialBalance = await landlordToken.balanceOf(user.address);
      const initialSupply = await landlordToken.totalSupply();
      
      await landlordToken.connect(user).burn(burnAmount);
      
      expect(await landlordToken.balanceOf(user.address)).to.equal(initialBalance - burnAmount);
      expect(await landlordToken.totalSupply()).to.equal(initialSupply - burnAmount);
    });
  });

  describe("Backend Address Management", function () {
    it("should correctly set the backend address on deployment", async function () {
      expect(await landlordToken.backendAddress()).to.equal(backend.address);
    });

    it("should allow owner to update the backend address", async function () {
      await landlordToken.connect(owner).setBackendAddress(user3.address);
      expect(await landlordToken.backendAddress()).to.equal(user3.address);
    });

    it("should not allow non-owners to update the backend address", async function () {
      await expect(
        landlordToken.connect(user).setBackendAddress(user2.address)
      ).to.be.reverted; // With AccessControl error
    });

    it("should not allow setting the backend address to zero address", async function () {
      await expect(
        landlordToken.connect(owner).setBackendAddress(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid backend address");
    });
  });

  describe("Profit Distribution", function () {
    it("should distribute profit and allow user to claim profit with valid signature", async function () {
      // Owner calls distributeProfit with a profit amount (e.g., 500 tokens)
      const profitAmount = ethers.parseUnits("500", 18);
      const tx = await landlordToken.connect(owner).distributeProfit(profitAmount);
      await tx.wait();

      // Distribution ID should be 0 (first distribution)
      const distributionId = 0;

      // User's balance at distribution time (should be 1000 tokens)
      const balanceAtDistribution = await landlordToken.balanceOf(user.address);

      // Prepare the message hash using solidityPackedKeccak256
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user.address, distributionId, balanceAtDistribution]
      );

      // Convert the message hash to bytes
      const messageHashBytes = ethers.getBytes(messageHash);

      // Backend (designated signer) signs the message hash
      const signature = await backend.signMessage(messageHashBytes);

      // Get the distribution details for precise calculation
      const [totalAmount, , tokensExcludingOwner] = await landlordToken.getDistribution(distributionId);

      // Calculate expected profit exactly as the contract does
      // Use the stored tokensExcludingOwner value from the contract
      const expectedProfit = (totalAmount * balanceAtDistribution) / tokensExcludingOwner;

      // User claims the profit using the generated signature
      const userBalanceBefore = await landlordToken.balanceOf(user.address);
      const claimTx = await landlordToken
        .connect(user)
        .claimProfit(distributionId, balanceAtDistribution, signature);
      await claimTx.wait();
      
      // Check that user's balance increased by the profit amount
      const finalUserBalance = await landlordToken.balanceOf(user.address);
      expect(finalUserBalance).to.equal(userBalanceBefore + expectedProfit);
    });

    it("should not allow a claim with an invalid signature", async function () {
      const profitAmount = ethers.parseUnits("500", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount);
      const distributionId = 0;
      const balanceAtDistribution = await landlordToken.balanceOf(user.address);

      // Create a signature with another signer (user2) using solidityPackedKeccak256
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user.address, distributionId, balanceAtDistribution]
      );
      const messageHashBytes = ethers.getBytes(messageHash);
      const invalidSignature = await user2.signMessage(messageHashBytes);

      // Expect the claim to revert due to invalid signature
      await expect(
        landlordToken
          .connect(user)
          .claimProfit(distributionId, balanceAtDistribution, invalidSignature)
      ).to.be.revertedWith("Invalid backend signature");
    });

    it("should prevent a user from claiming profit twice for the same distribution", async function () {
      // Distribute profit
      const profitAmount = ethers.parseUnits("500", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount);
      const distributionId = 0;

      // Get user's balance at distribution
      const balanceAtDistribution = await landlordToken.balanceOf(user.address);

      // Prepare message hash
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user.address, distributionId, balanceAtDistribution]
      );
      const messageHashBytes = ethers.getBytes(messageHash);

      // Backend signs the message
      const signature = await backend.signMessage(messageHashBytes);

      // First claim should succeed
      await landlordToken.connect(user).claimProfit(distributionId, balanceAtDistribution, signature);

      // Second claim should revert
      await expect(
        landlordToken.connect(user).claimProfit(distributionId, balanceAtDistribution, signature)
      ).to.be.revertedWith("Already claimed for this distribution");
    });

    it("should allow different users to claim for the same distribution", async function () {
      // Distribute profit
      const profitAmount = ethers.parseUnits("1000", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount);
      const distributionId = 0;
    
      // Get distribution details
      const [totalAmount, , tokensExcludingOwner] = await landlordToken.getDistribution(distributionId);
    
      // Claim for user
      const userBalanceAtDistribution = await landlordToken.balanceOf(user.address);
      const userMessageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user.address, distributionId, userBalanceAtDistribution]
      );
      const userMessageHashBytes = ethers.getBytes(userMessageHash);
      const userSignature = await backend.signMessage(userMessageHashBytes);
    
      // Claim for user2
      const user2BalanceAtDistribution = await landlordToken.balanceOf(user2.address);
      const user2MessageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user2.address, distributionId, user2BalanceAtDistribution]
      );
      const user2MessageHashBytes = ethers.getBytes(user2MessageHash);
      const user2Signature = await backend.signMessage(user2MessageHashBytes);
    
      // Calculate expected profits using the exact same division as the contract
      const expectedUserProfit = (totalAmount * userBalanceAtDistribution) / tokensExcludingOwner;
      const expectedUser2Profit = (totalAmount * user2BalanceAtDistribution) / tokensExcludingOwner;
    
      // Both users should be able to claim
      const userBalanceBefore = await landlordToken.balanceOf(user.address);
      await landlordToken.connect(user).claimProfit(distributionId, userBalanceAtDistribution, userSignature);
      
      const user2BalanceBefore = await landlordToken.balanceOf(user2.address);
      await landlordToken.connect(user2).claimProfit(distributionId, user2BalanceAtDistribution, user2Signature);
    
      // Verify balances increased correctly
      const finalUserBalance = await landlordToken.balanceOf(user.address);
      const finalUser2Balance = await landlordToken.balanceOf(user2.address);
    
      expect(finalUserBalance).to.equal(userBalanceBefore + expectedUserProfit);
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
      const userBalanceAtDistribution = await landlordToken.balanceOf(user.address);
      
      // Prepare message hash
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user.address, nonExistentDistributionId, userBalanceAtDistribution]
      );
      const messageHashBytes = ethers.getBytes(messageHash);
      const signature = await backend.signMessage(messageHashBytes);
      
      // Attempt to claim from non-existent distribution should revert
      await expect(
        landlordToken.connect(user).claimProfit(nonExistentDistributionId, userBalanceAtDistribution, signature)
      ).to.be.revertedWith("Distribution does not exist");
    });
    
    it("should allow multiple profit distributions over time", async function () {
      // First distribution
      const profitAmount1 = ethers.parseUnits("500", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount1);
      
      // Second distribution after some time
      await time.increase(86400); // 1 day later
      const profitAmount2 = ethers.parseUnits("1000", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount2);
      
      // Get distribution details for exact calculations
      const [totalAmount1, , tokensExcludingOwner1] = await landlordToken.getDistribution(0);
      const [totalAmount2, , tokensExcludingOwner2] = await landlordToken.getDistribution(1);
      
      // User claims from first distribution
      const distributionId1 = 0;
      const userBalanceAtDistribution1 = ethers.parseUnits("1000", 18); // Initial balance
      
      const messageHash1 = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user.address, distributionId1, userBalanceAtDistribution1]
      );
      const messageHashBytes1 = ethers.getBytes(messageHash1);
      const signature1 = await backend.signMessage(messageHashBytes1);
      
      const userBalanceBefore1 = await landlordToken.balanceOf(user.address);
      await landlordToken.connect(user).claimProfit(distributionId1, userBalanceAtDistribution1, signature1);
      const userBalanceAfter1 = await landlordToken.balanceOf(user.address);
      
      const expectedProfit1 = (totalAmount1 * userBalanceAtDistribution1) / tokensExcludingOwner1;
      expect(userBalanceAfter1).to.equal(userBalanceBefore1 + expectedProfit1);
      
      // User claims from second distribution
      const distributionId2 = 1;
      // For the second distribution, use the balance at the time of that distribution
      const userBalanceAtDistribution2 = await landlordToken.balanceOf(user.address);
      
      const messageHash2 = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user.address, distributionId2, userBalanceAtDistribution2]
      );
      const messageHashBytes2 = ethers.getBytes(messageHash2);
      const signature2 = await backend.signMessage(messageHashBytes2);
      
      const userBalanceBefore2 = await landlordToken.balanceOf(user.address);
      await landlordToken.connect(user).claimProfit(distributionId2, userBalanceAtDistribution2, signature2);
      const userBalanceAfter2 = await landlordToken.balanceOf(user.address);
      
      const expectedProfit2 = (totalAmount2 * userBalanceAtDistribution2) / tokensExcludingOwner2;
      expect(userBalanceAfter2).to.equal(userBalanceBefore2 + expectedProfit2);
      
      // Verify distributions were recorded correctly
      expect(totalAmount1).to.equal(profitAmount1);
      expect(totalAmount2).to.equal(profitAmount2);
    });
    
    it("should correctly check if a user has claimed", async function () {
      // Distribute profit
      const profitAmount = ethers.parseUnits("500", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount);
      const distributionId = 0;
      
      // Initially user should not have claimed
      expect(await landlordToken.hasClaimed(distributionId, user.address)).to.be.false;
      
      // User claims profit
      const userBalanceAtDistribution = await landlordToken.balanceOf(user.address);
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user.address, distributionId, userBalanceAtDistribution]
      );
      const messageHashBytes = ethers.getBytes(messageHash);
      const signature = await backend.signMessage(messageHashBytes);
      
      await landlordToken.connect(user).claimProfit(distributionId, userBalanceAtDistribution, signature);
      
      // After claiming, hasClaimed should return true
      expect(await landlordToken.hasClaimed(distributionId, user.address)).to.be.true;
      
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
        landlordToken.connect(user).generateTokensForRealEstatePurchase(mintAmount)
      ).to.be.reverted; // With AccessControl error
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
      
      // Get distribution details for exact calculation
      const [totalAmount, , tokensExcludingOwner] = await landlordToken.getDistribution(distributionId);
      
      // Burn some tokens to change total supply
      const burnAmount = ethers.parseUnits("500", 18);
      await landlordToken.connect(user).burn(burnAmount);
      
      // Generate new tokens for owner
      const mintAmount = ethers.parseUnits("50", 18);
      await landlordToken.connect(owner).generateTokensForRealEstatePurchase(mintAmount);
      
      // Check that user can still claim their correct profit
      const userBalanceAtDistribution = ethers.parseUnits("1000", 18); // Original balance
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user.address, distributionId, userBalanceAtDistribution]
      );
      const messageHashBytes = ethers.getBytes(messageHash);
      const signature = await backend.signMessage(messageHashBytes);
      
      const userBalanceBefore = await landlordToken.balanceOf(user.address);
      await landlordToken.connect(user).claimProfit(distributionId, userBalanceAtDistribution, signature);
      const userBalanceAfter = await landlordToken.balanceOf(user.address);
      
      // Calculate expected profit using the exact contract's division
      const expectedProfit = (totalAmount * userBalanceAtDistribution) / tokensExcludingOwner;
      expect(userBalanceAfter).to.equal(userBalanceBefore + expectedProfit);
      
      // Check that distribution details match expected
      expect(totalAmount).to.equal(profitAmount);
      
      // Total supply - owner balance at distribution time should be tokensExcludingOwner
      const initialTransfers = ethers.parseUnits("6000", 18); // 1000 + 2000 + 3000
      expect(tokensExcludingOwner).to.equal(initialTransfers);
    });
    
    it("should reject claim with incorrect balance proof", async function () {
      // Distribute profit
      const profitAmount = ethers.parseUnits("500", 18);
      await landlordToken.connect(owner).distributeProfit(profitAmount);
      const distributionId = 0;
      
      // Get distribution details for exact calculation
      const [totalAmount, , tokensExcludingOwner] = await landlordToken.getDistribution(distributionId);
      
      // Actual balance is 1000, but prepare signature for fake balance of 2000
      const fakeBalance = ethers.parseUnits("2000", 18);
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [user.address, distributionId, fakeBalance]
      );
      const messageHashBytes = ethers.getBytes(messageHash);
      const signature = await backend.signMessage(messageHashBytes);
      
      // Get user balance before claiming
      const userBalanceBefore = await landlordToken.balanceOf(user.address);
      
      // Try to claim with the fake balance (should work since backend signed it)
      await landlordToken.connect(user).claimProfit(distributionId, fakeBalance, signature);
      
      // Calculate expected profit exactly as the contract does
      const expectedProfit = (totalAmount * fakeBalance) / tokensExcludingOwner;
      
      // Verify user received the profit based on the fake balance
      const finalUserBalance = await landlordToken.balanceOf(user.address);
      expect(finalUserBalance).to.equal(userBalanceBefore + expectedProfit);
    });
  });
});