import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// ERC20 ABI fragment to call balanceOf
const ERC20_ABI = ['function balanceOf(address account) external view returns (uint256)'];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userAddress = url.searchParams.get('userAddress');
    const distributionId = url.searchParams.get('distributionId');
    const block = url.searchParams.get('block'); // Optional: allow frontend to send a block

    if (!userAddress || !distributionId) {
      return NextResponse.json({ error: 'userAddress and distributionId are required.' }, { status: 400 });
    }

    const distributionIdNum = parseInt(distributionId, 10);
    if (isNaN(distributionIdNum)) {
      return NextResponse.json({ error: 'distributionId must be a valid number.' }, { status: 400 });
    }

    // Load required env variables
    const privateKey = process.env.PRIVATE_KEY;
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const rpcUrl = process.env.RPC_URL;

    if (!privateKey || !tokenAddress || !rpcUrl) {
      return NextResponse.json(
        { error: 'Missing environment variables (PRIVATE_KEY, TOKEN_ADDRESS, RPC_URL).' },
        { status: 500 }
      );
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const backendWallet = new ethers.Wallet(privateKey, provider);

    // Connect to token contract
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    // Use provided block or fallback to latest
    const blockTag = block ? parseInt(block, 10) : 'latest';
    if (block && isNaN(Number(blockTag))) {
      return NextResponse.json({ error: 'block must be a valid number if provided.' }, { status: 400 });
    }

    // Get user balance at specified block
    const balanceAtDistribution = await tokenContract.balanceOf(userAddress, { blockTag });

    // Create hash of the message
    const messageHash = ethers.solidityPackedKeccak256(
      ['address', 'uint256', 'uint256'],
      [userAddress, distributionIdNum, balanceAtDistribution]
    );

    // Create Ethereum-signed message hash
    const ethSignedMessageHash = ethers.keccak256(
      ethers.concat([
        ethers.toUtf8Bytes('\x19Ethereum Signed Message:\n32'),
        messageHash,
      ])
    );

    // Sign and verify
    const signature = await backendWallet.signMessage(ethers.getBytes(messageHash));
    const recoveredSigner = ethers.verifyMessage(ethers.getBytes(messageHash), signature);
    const isValid = recoveredSigner === backendWallet.address;

    return NextResponse.json({
      backendAddress: backendWallet.address,
      userAddress,
      distributionId: distributionIdNum,
      blockTag,
      balanceAtDistribution: balanceAtDistribution.toString(),
      messageHash,
      ethSignedMessageHash,
      signature,
      recoveredSigner,
      isValid,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Something went wrong', details: errorMessage },
      { status: 500 }
    );
  }
}
