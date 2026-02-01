import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

const ERC20_ABI = ['function balanceOf(address account) external view returns (uint256)'];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userAddress = url.searchParams.get('userAddress');
    const distributionId = url.searchParams.get('distributionId');
    const block = url.searchParams.get('block');

    if (!userAddress || !distributionId) {
      return NextResponse.json({ error: 'userAddress and distributionId are required.' }, { status: 400 });
    }

    const distributionIdNum = parseInt(distributionId, 10);
    if (isNaN(distributionIdNum)) {
      return NextResponse.json({ error: 'distributionId must be a valid number.' }, { status: 400 });
    }

    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const rpcUrl = process.env.RPC_URL;

    if (!privateKey || !contractAddress || !rpcUrl) {
      return NextResponse.json(
        { error: 'Missing environment variables (PRIVATE_KEY, NEXT_PUBLIC_CONTRACT_ADDRESS, RPC_URL).' },
        { status: 500 }
      );
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const backendWallet = new ethers.Wallet(privateKey, provider);
    const tokenContract = new ethers.Contract(contractAddress, ERC20_ABI, provider);

    const blockTag = block ? parseInt(block, 10) : 'latest';
    if (block && isNaN(Number(blockTag))) {
      return NextResponse.json({ error: 'block must be a valid number if provided.' }, { status: 400 });
    }

    const balanceAtDistribution = await tokenContract.balanceOf(userAddress, { blockTag });

    const messageHash = ethers.solidityPackedKeccak256(
      ['address', 'uint256', 'uint256'],
      [userAddress, distributionIdNum, balanceAtDistribution]
    );

    const signature = await backendWallet.signMessage(ethers.getBytes(messageHash));

    return NextResponse.json({
      signature,
      balanceAtDistribution: balanceAtDistribution.toString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Something went wrong', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAddress, distributionId, balanceAtDistribution } = body;

    if (!userAddress || distributionId === undefined || !balanceAtDistribution) {
      return NextResponse.json(
        { error: 'userAddress, distributionId, and balanceAtDistribution are required.' },
        { status: 400 }
      );
    }

    const distributionIdNum = parseInt(distributionId, 10);
    if (isNaN(distributionIdNum)) {
      return NextResponse.json({ error: 'distributionId must be a valid number.' }, { status: 400 });
    }

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json(
        { error: 'Missing environment variable (PRIVATE_KEY).' },
        { status: 500 }
      );
    }

    const backendWallet = new ethers.Wallet(privateKey);

    const messageHash = ethers.solidityPackedKeccak256(
      ['address', 'uint256', 'uint256'],
      [userAddress, distributionIdNum, balanceAtDistribution]
    );

    const signature = await backendWallet.signMessage(ethers.getBytes(messageHash));

    return NextResponse.json({ signature });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Something went wrong', details: errorMessage },
      { status: 500 }
    );
  }
}
