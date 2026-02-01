import { NextResponse } from 'next/server';
import { ethers, Result } from 'ethers';

// ABI for LandLordToken.
const LANDLORD_TOKEN_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function getDistribution(uint256 distributionId) external view returns (uint256 totalAmount, uint256 distributionDate, uint256 distributionBlock, uint256 tokensExcludingOwner)',
  // Updated ABI for getUnclaimedDistributions to include 'id' in the returned struct
  'function getUnclaimedDistributions(address user) external view returns (tuple(uint256 id, uint256 totalAmount, uint256 distributionDate, uint256 distributionBlock, uint256 tokensExcludingOwner)[] memory)',
];

// Define an interface for your Solidity struct's properties
interface ProfitDistributionViewInterface {
  id: bigint;
  totalAmount: bigint;
  distributionDate: bigint;
  distributionBlock: bigint;
  tokensExcludingOwner: bigint;
}

// Create a type that combines ethers.Result with your interface
type UnclaimedDistributionResult = Result & ProfitDistributionViewInterface;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userAddress = url.searchParams.get('userAddress');
    const blockParam = url.searchParams.get('block');

    if (!userAddress) {
      return NextResponse.json({ error: 'userAddress is required.' }, { status: 400 });
    }

    if (!ethers.isAddress(userAddress)) {
      return NextResponse.json({ error: 'Invalid userAddress format.' }, { status: 400 });
    }

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const rpcUrl = process.env.RPC_URL;

    if (!contractAddress || !rpcUrl) {
      return NextResponse.json(
        { error: 'Missing environment variables (NEXT_PUBLIC_CONTRACT_ADDRESS, RPC_URL).' },
        { status: 500 }
      );
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const landLordTokenContract = new ethers.Contract(contractAddress, LANDLORD_TOKEN_ABI, provider);

    let currentBlockTag: string | number = 'latest';
    if (blockParam) {
      const parsedBlock = parseInt(blockParam, 10);
      if (isNaN(parsedBlock) || parsedBlock < 0) {
        return NextResponse.json({ error: 'block must be a valid non-negative number if provided.' }, { status: 400 });
      }
      currentBlockTag = parsedBlock;
    }

    // Fetch user's current token balance (or at the specified blockParam)
    const currentBalance: bigint = await landLordTokenContract.balanceOf(userAddress, { blockTag: currentBlockTag });

    // Fetch the array of unclaimed ProfitDistributionView structs for the user.
    // We fetch this at the `currentBlockTag` to get the list of distributions available at that point.
    const unclaimedDistributionsRaw: UnclaimedDistributionResult[] = await landLordTokenContract.getUnclaimedDistributions(userAddress, { blockTag: currentBlockTag });
    
    const availableDistributionsWithShare: object[] = [];

    for (const dist of unclaimedDistributionsRaw) {
      try {
        // Fetch user's balance at the exact block of this specific distribution
        const userBalanceAtDistributionBlock: bigint = await landLordTokenContract.balanceOf(
          userAddress,
          { blockTag: Number(dist.distributionBlock) } // Convert BigInt to number for blockTag
        );

        let userShare: bigint;
        // Calculate user's share: (user balance at blocktime / tokensExcludingOwner) * totalAmount
        if (dist.tokensExcludingOwner > 0) {
          userShare = (userBalanceAtDistributionBlock * dist.totalAmount) / dist.tokensExcludingOwner;
        } else {
          userShare = BigInt(0); // If no eligible tokens in total, share is 0
        }

        // --- NEW: Only include distribution if userShare is greater than 0 ---
        if (userShare > BigInt(0)) {
          availableDistributionsWithShare.push({
            id: dist.id.toString(),
            totalAmount: dist.totalAmount.toString(),
            distributionDate: new Date(Number(dist.distributionDate) * 1000).toISOString(),
            distributionBlock: dist.distributionBlock.toString(),
            tokensExcludingOwner: dist.tokensExcludingOwner.toString(),
            userBalanceAtDistributionBlock: userBalanceAtDistributionBlock.toString(),
            userShare: userShare.toString(),
          });
        }
      } catch (distErr) {
        console.error(`Error processing unclaimed distribution ID ${dist.id.toString()}:`, distErr);
      }
    }

    return NextResponse.json({
      balance: currentBalance.toString(),
      availableDistributions: availableDistributionsWithShare,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Something went wrong while fetching data.', details: errorMessage },
      { status: 500 }
    );
  }
}