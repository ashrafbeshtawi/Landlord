import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// ABI for LandLordToken.
const LANDLORD_TOKEN_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function getDistribution(uint256 distributionId) external view returns (uint256 totalAmount, uint256 distributionDate, uint256 distributionBlock, uint256 tokensExcludingOwner)',
  'function getUnclaimedDistributions(address user) external view returns (uint256[] memory)', // Add this function to the ABI
];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userAddress = url.searchParams.get('userAddress');
    const block = url.searchParams.get('block'); // Optional

    if (!userAddress) {
      return NextResponse.json({ error: 'userAddress is required.' }, { status: 400 });
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

    const blockTag = block ? parseInt(block, 10) : 'latest';
    if (block && isNaN(Number(blockTag))) {
      return NextResponse.json({ error: 'block must be a valid number if provided.' }, { status: 400 });
    }

    // Fetch user's token balance and convert to string
    const balance = await landLordTokenContract.balanceOf(userAddress, { blockTag });

    const availableDistributions: object[] = [];

    // Fetch the array of unclaimed distribution IDs for the user.
    // In ethers v6, uint256[] typically returns an array of native BigInts.
    const unclaimedIds: bigint[] = await landLordTokenContract.getUnclaimedDistributions(userAddress);

    // Loop over the unclaimed IDs and fetch details for each
    for (const id of unclaimedIds) {
      // Convert BigInt to a standard number.
      // This is generally safe for IDs as they are typically sequential and not astronomically large.
      const distributionId = Number(id);
      
      try {
        const distributionDetails = await landLordTokenContract.getDistribution(distributionId);

        availableDistributions.push({
          id: distributionId,
          // Convert all BigInt values from contract details to string before sending in JSON
          totalAmount: distributionDetails.totalAmount.toString(),
          // block.timestamp is uint256, but typically fits in standard JS number for Date conversion
          distributionDate: new Date(Number(distributionDetails.distributionDate) * 1000).toISOString(),
          // block.number is uint256, convert to string
          distributionBlock: distributionDetails.distributionBlock.toString(),
          // tokensExcludingOwner is uint256, convert to string
          tokensExcludingOwner: distributionDetails.tokensExcludingOwner.toString(),
        });
      } catch (distErr) {
        console.error(`Error fetching details for unclaimed distribution ID ${distributionId}:`, distErr);
      }
    }

    return NextResponse.json({
      // Ensure the balance is a string
      balance: balance.toString(),
      availableDistributions: availableDistributions,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Something went wrong', details: errorMessage },
      { status: 500 }
    );
  }
}