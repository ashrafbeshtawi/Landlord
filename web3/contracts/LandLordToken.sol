// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LandLordToken is ERC20, Ownable, ReentrancyGuard {
    // Set decimals to 18 for BNB/BSC compatibility
    uint8 private constant _decimals = 18;
    
    // Initial supply is 10^14 tokens
    uint256 private constant INITIAL_SUPPLY = 10 ** 14 * 10 ** _decimals;

    // Minting restriction: 3% max every 90 days
    uint256 public lastMintTimestamp;
    uint256 public constant MINT_INTERVAL = 90 days;
    uint256 public constant MAX_MINT_PERCENTAGE = 3;

    // Events
    event TokensMinted(address indexed to, uint256 amount, uint256 timestamp);

    // Struct to store profit distribution information
    struct ProfitDistribution {
        uint256 totalAmount;
        uint256 distributionDate;
        uint256 distributionBlock;
        uint256 tokensExcludingOwner;  // total supply - owner balance at distribution time
        mapping(address => bool) claimed;
    }

    // New struct for returning distribution details without the `claimed` mapping
    // Added 'id' to reflect the distribution's index in the array
    struct ProfitDistributionView {
        uint256 id; // The index of the distribution in the profitDistributions array
        uint256 totalAmount;
        uint256 distributionDate;
        uint256 distributionBlock;
        uint256 tokensExcludingOwner;
    }

    // Array to store all profit distributions
    ProfitDistribution[] private profitDistributions;

    address public backendAddress; // server's public address

    // Events for profit distribution and claims
    event ProfitDistributed(uint256 indexed distributionId, uint256 amount, uint256 date);
    event ProfitClaimed(address indexed user, uint256 indexed distributionId, uint256 amount);

    constructor() ERC20("LandLord", "LND") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
        backendAddress = msg.sender; // Initialize backend to owner
    }

    function setBackendAddress(address newBackend) external onlyOwner {
        require(newBackend != address(0), "Invalid backend address");
        backendAddress = newBackend;
    }

    // Admin function to distribute profits
    function distributeProfit(uint256 profitAmount) external onlyOwner {
        require(profitAmount > 0, "Number of Tokens must be bigger than 0");

        uint256 distributionId = profitDistributions.length;
        
        // Create new profit distribution
        ProfitDistribution storage newDistribution = profitDistributions.push();
        newDistribution.totalAmount = profitAmount;
        newDistribution.distributionDate = block.timestamp;
        newDistribution.distributionBlock = block.number;
        
        // Calculate tokens excluding owner at this point
        uint256 ownerBalance = balanceOf(owner());
        uint256 totalSupplyValue = totalSupply();
        require(totalSupplyValue > ownerBalance, "No eligible holders for distribution");
        
        newDistribution.tokensExcludingOwner = totalSupplyValue - ownerBalance;
        
        emit ProfitDistributed(distributionId, profitAmount, block.timestamp);
    }

    function claimProfit(
        uint256 distributionId,
        uint256 balanceAtDistribution,
        bytes memory signature
    ) external nonReentrant {
        require(distributionId < profitDistributions.length, "Distribution does not exist");
        ProfitDistribution storage distribution = profitDistributions[distributionId];

        require(!distribution.claimed[msg.sender], "Already claimed for this distribution");
        require(msg.sender != owner(), "Owner cannot claim");

        // Prepare the message to verify: must match exactly what the backend signed
        bytes32 messageHash = keccak256(
            abi.encodePacked(msg.sender, distributionId, balanceAtDistribution)
        );

        // Manually convert to Ethereum signed message hash
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        // Recover signer from signature
        address recoveredSigner = ECDSA.recover(ethSignedMessageHash, signature);
        require(recoveredSigner == backendAddress, "Invalid backend signature");

        // Mark as claimed
        distribution.claimed[msg.sender] = true;

        // Calculate and transfer profit using native arithmetic operators
        uint256 userShare = distribution.totalAmount * balanceAtDistribution / distribution.tokensExcludingOwner;

        _transfer(owner(), msg.sender, userShare);

        emit ProfitClaimed(msg.sender, distributionId, userShare);
    }

    /**
     * @notice Helper function to retrieve details of a specific profit distribution as ProfitDistributionView.
     * @param distributionId The ID of the distribution to retrieve.
     * @return A ProfitDistributionView struct containing the distribution's details.
     */
    function getDistribution(uint256 distributionId) external view returns (ProfitDistributionView memory) {
        require(distributionId < profitDistributions.length, "Distribution does not exist");
        ProfitDistribution storage distribution = profitDistributions[distributionId];
        return ProfitDistributionView({
            id: distributionId, // Populate the new 'id' field
            totalAmount: distribution.totalAmount,
            distributionDate: distribution.distributionDate,
            distributionBlock: distribution.distributionBlock,
            tokensExcludingOwner: distribution.tokensExcludingOwner
        });
    }

    // Helper function to check if an address has claimed a specific profit distribution.
    function hasClaimed(uint256 distributionId, address user) external view returns (bool) {
        require(distributionId < profitDistributions.length, "Distribution does not exist");
        ProfitDistribution storage distribution = profitDistributions[distributionId];
        return distribution.claimed[user];
    }

    /**
     * @notice Returns an array of ProfitDistributionView objects for distributions
     * that the given user has not yet claimed.
     * Includes the distribution ID (its index) in the returned struct.
     * @param user The address to check unclaimed distributions for.
     * @return unclaimedDistributionsArray Array of ProfitDistributionView objects not claimed by the user.
    */
    function getUnclaimedDistributions(address user) external view returns (ProfitDistributionView[] memory unclaimedDistributionsArray) {
        // --- ADDED: Return empty array if the caller is the contract owner ---
        if (user == owner()) {
            return new ProfitDistributionView[](0);
        }

        uint256 total = profitDistributions.length;
        uint256 count = 0;

        // First pass: count unclaimed
        for (uint256 i = 0; i < total; i++) {
            if (!profitDistributions[i].claimed[user]) {
                count++;
            }
        }

        // Allocate array of correct size
        unclaimedDistributionsArray = new ProfitDistributionView[](count);
        uint256 index = 0;

        // Second pass: populate array with ProfitDistributionView data
        for (uint256 i = 0; i < total; i++) {
            if (!profitDistributions[i].claimed[user]) {
                ProfitDistribution storage distribution = profitDistributions[i];
                unclaimedDistributionsArray[index] = ProfitDistributionView({
                    id: i, // Populate the 'id' field with the current index 'i'
                    totalAmount: distribution.totalAmount,
                    distributionDate: distribution.distributionDate,
                    distributionBlock: distribution.distributionBlock,
                    tokensExcludingOwner: distribution.tokensExcludingOwner
                });
                index++;
            }
        }

        return unclaimedDistributionsArray;
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function generateTokensForRealEstatePurchase(uint256 amount) public onlyOwner {
        require(
            lastMintTimestamp == 0 || block.timestamp >= lastMintTimestamp + MINT_INTERVAL,
            "Must wait 90 days between mints"
        );

        uint256 maxMintAmount = (totalSupply() * MAX_MINT_PERCENTAGE) / 100;
        require(amount <= maxMintAmount, "Minting amount exceeds 3% of total supply");

        lastMintTimestamp = block.timestamp;
        _mint(owner(), amount);

        emit TokensMinted(owner(), amount, block.timestamp);
    }

    // Override decimals function explicitly.
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}