// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract LandLordToken is ERC20, Ownable {
    // Set decimals to 18 for BNB/BSC compatibility
    uint8 private constant _decimals = 18;
    
    // Initial supply is 10^14 tokens
    uint256 private constant INITIAL_SUPPLY = 10 ** 14 * 10 ** _decimals;

    // Struct to store profit distribution information
    struct ProfitDistribution {
        uint256 totalAmount;
        uint256 distributionDate;
        uint256 tokensExcludingOwner;  // total supply - owner balance at distribution time
        mapping(address => bool) claimed;
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
    ) external {
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

    // Optional: Functions for token burning if you want to reduce supply
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    // Optional: Functions for additional minting if needed
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
