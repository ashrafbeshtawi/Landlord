const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandLordToken", function () {
  let LandLordToken, landlordToken;
  let owner, backend, user, other;

  beforeEach(async function () {
    [owner, backend, user, other] = await ethers.getSigners();
    LandLordToken = await ethers.getContractFactory("LandLordToken");
    landlordToken = await LandLordToken.deploy();
    await landlordToken.waitForDeployment(); // ethers v6 equivalent

    // Set backend address to a non-owner account (backend)
    await landlordToken.connect(owner).setBackendAddress(backend.address);

    // Transfer tokens from owner to user so that user has a positive balance
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
});
