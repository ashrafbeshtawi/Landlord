import { NextResponse } from 'next/server';
import { ethers, Result } from 'ethers'; // Import Result from ethers

// ABI for LandLordToken.
const LANDLORD_TOKEN_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function getDistribution(uint256 distributionId) external view returns (uint256 totalAmount, uint256 distributionDate, uint256 distributionBlock, uint256 tokensExcludingOwner)',
  'function getUnclaimedDistributions(address user) external view returns (tuple(uint256 id, uint256 totalAmount, uint256 distributionDate, uint256 distributionBlock, uint256 tokensExcludingOwner)[] memory)',
];

// 1. Define an interface for your Solidity struct's properties
//    Note: In ethers.js v6, uint256 values are returned as native BigInts.
interface ProfitDistributionViewInterface {
  id: bigint;
  totalAmount: bigint;
  distributionDate: bigint;
  distributionBlock: bigint;
  tokensExcludingOwner: bigint;
  // If your struct has other properties, add them here
  // e.g., someOtherField: bigint;
}

// 2. Create a type that combines ethers.Result with your interface
//    This tells TypeScript that the object is an ethers.Result and also
//    guarantees it has the properties defined in ProfitDistributionViewInterface.
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

    const tokenAddress = process.env.TOKEN_ADDRESS;
    const rpcUrl = process.env.RPC_URL;

    if (!tokenAddress || !rpcUrl) {
      return NextResponse.json(
        { error: 'Missing environment variables (TOKEN_ADDRESS, RPC_URL).' },
        { status: 500 }
      );
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const landLordTokenContract = new ethers.Contract(tokenAddress, LANDLORD_TOKEN_ABI, provider);

    let blockTag: string | number = 'latest';
    if (blockParam) {
      const parsedBlock = parseInt(blockParam, 10);
      if (isNaN(parsedBlock) || parsedBlock < 0) {
        return NextResponse.json({ error: 'block must be a valid non-negative number if provided.' }, { status: 400 });
      }
      blockTag = parsedBlock;
    }

    const balance: bigint = await landLordTokenContract.balanceOf(userAddress, { blockTag });

    // 3. Use the newly defined type here
    const unclaimedDistributionsRaw: UnclaimedDistributionResult[] = await landLordTokenContract.getUnclaimedDistributions(userAddress);
    const availableDistributions: object[] = [];

    for (const dist of unclaimedDistributionsRaw) {
      try {
        availableDistributions.push({
          id: dist.id.toString(),
          totalAmount: dist.totalAmount.toString(),
          distributionDate: new Date(Number(dist.distributionDate) * 1000).toISOString(),
          distributionBlock: dist.distributionBlock.toString(),
          tokensExcludingOwner: dist.tokensExcludingOwner.toString(),
        });
      } catch (distErr) {
        console.error(`Error processing unclaimed distribution:`, distErr);
      }
    }

    return NextResponse.json({
      balance: balance.toString(),
      availableDistributions: availableDistributions,
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