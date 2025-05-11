import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// ERC20 ABI fragment to call balanceOf
const ERC20_ABI = ['function balanceOf(address account) external view returns (uint256)'];

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
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    const blockTag = block ? parseInt(block, 10) : 'latest';
    if (block && isNaN(Number(blockTag))) {
      return NextResponse.json({ error: 'block must be a valid number if provided.' }, { status: 400 });
    }

    const balance = await tokenContract.balanceOf(userAddress, { blockTag });

    return NextResponse.json({
      balance: balance.toString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Something went wrong', details: errorMessage },
      { status: 500 }
    );
  }
}
