const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandLordToken", function () {
  let LandLordToken, landlordToken;
  let owner, backend, user, other;

  beforeEach(async function () {
    [owner, backend, user, other] = await ethers.getSigners();
    LandLordToken = await ethers.getContractFactory("LandLordToken");
    landlordToken = await LandLordToken.deploy();
    await landlordToken.waitForDeployment();

    await landlordToken.connect(owner).setBackendAddress(backend.address);

    const transferAmount = ethers.parseUnits("1000", 18);
    await landlordToken.connect(owner).transfer(user.address, transferAmount);
  });

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

    // User claims the profit using the generated signature
    const claimTx = await landlordToken
      .connect(user)
      .claimProfit(distributionId, balanceAtDistribution, signature);
    await claimTx.wait();

    // Expected profit calculation:
    // tokensExcludingOwner = totalSupply - ownerBalance at distribution time.
    // Initially, owner held the entire supply. After transferring 1000 tokens to user,
    // owner holds initialSupply - 1000, so tokensExcludingOwner = 1000 tokens.
    // User share = profitAmount * balanceAtDistribution / tokensExcludingOwner = 500 * 1000 / 1000 = 500 tokens.
    const expectedProfit = ethers.parseUnits("500", 18);

    // Check that user's balance increased by the profit amount
    const finalUserBalance = await landlordToken.balanceOf(user.address);
    expect(finalUserBalance).to.equal(balanceAtDistribution + expectedProfit);
  });

  it("should not allow a claim with an invalid signature", async function () {
    const profitAmount = ethers.parseUnits("500", 18);
    await landlordToken.connect(owner).distributeProfit(profitAmount);
    const distributionId = 0;
    const balanceAtDistribution = await landlordToken.balanceOf(user.address);

    // Create a signature with another signer (other) using solidityPackedKeccak256
    const messageHash = ethers.solidityPackedKeccak256(
      ["address", "uint256", "uint256"],
      [user.address, distributionId, balanceAtDistribution]
    );
    const messageHashBytes = ethers.getBytes(messageHash);
    const invalidSignature = await other.signMessage(messageHashBytes);

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
    // Transfer tokens to another user
    const transferAmount = ethers.parseUnits("2000", 18);
    await landlordToken.connect(owner).transfer(other.address, transferAmount);

    // Distribute profit
    const profitAmount = ethers.parseUnits("1000", 18);
    await landlordToken.connect(owner).distributeProfit(profitAmount);
    const distributionId = 0;

    // Claim for user
    const userBalanceAtDistribution = await landlordToken.balanceOf(user.address);
    const userMessageHash = ethers.solidityPackedKeccak256(
      ["address", "uint256", "uint256"],
      [user.address, distributionId, userBalanceAtDistribution]
    );
    const userMessageHashBytes = ethers.getBytes(userMessageHash);
    const userSignature = await backend.signMessage(userMessageHashBytes);

    // Claim for other user
    const otherBalanceAtDistribution = await landlordToken.balanceOf(other.address);
    const otherMessageHash = ethers.solidityPackedKeccak256(
      ["address", "uint256", "uint256"],
      [other.address, distributionId, otherBalanceAtDistribution]
    );
    const otherMessageHashBytes = ethers.getBytes(otherMessageHash);
    const otherSignature = await backend.signMessage(otherMessageHashBytes);

    // Both users should be able to claim
    await landlordToken.connect(user).claimProfit(distributionId, userBalanceAtDistribution, userSignature);
    await landlordToken.connect(other).claimProfit(distributionId, otherBalanceAtDistribution, otherSignature);

    // Verify balances increased correctly
    const expectedUserProfit = profitAmount * userBalanceAtDistribution / (await landlordToken.totalSupply() - await landlordToken.balanceOf(owner.address));
    const expectedOtherProfit = profitAmount * otherBalanceAtDistribution / (await landlordToken.totalSupply() - await landlordToken.balanceOf(owner.address));

    const finalUserBalance = await landlordToken.balanceOf(user.address);
    const finalOtherBalance = await landlordToken.balanceOf(other.address);

    expect(finalUserBalance).to.equal(userBalanceAtDistribution + expectedUserProfit);
    expect(finalOtherBalance).to.equal(otherBalanceAtDistribution + expectedOtherProfit);
  });

  it("should prevent owner from claiming profit", async function () {
    // Distribute profit
    const profitAmount = ethers.parseUnits("500", 18);
    await landlordToken.connect(owner).distributeProfit(profitAmount);
    const distributionId = 0;

    // Prepare message hash for owner
    const messageHash = ethers.solidityPackedKeccak256(
      ["address", "uint256", "uint256"],
      [owner.address, distributionId, await landlordToken.balanceOf(owner.address)]
    );
    const messageHashBytes = ethers.getBytes(messageHash);

    // Backend signs the message
    const signature = await backend.signMessage(messageHashBytes);

    // Attempt to claim by owner should revert
    await expect(
      landlordToken.connect(owner).claimProfit(distributionId, await landlordToken.balanceOf(owner.address), signature)
    ).to.be.revertedWith("Owner cannot claim");
  });
  
});
