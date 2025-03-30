import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userAddress = url.searchParams.get('userAddress');
    const distributionId = url.searchParams.get('distributionId');

    if (!userAddress || !distributionId) {
      return NextResponse.json({ error: 'userAddress and distributionId are required.' }, { status: 400 });
    }

    const distributionIdNum = parseInt(distributionId, 10);
    if (isNaN(distributionIdNum)) {
      return NextResponse.json({ error: 'distributionId must be a valid number.' }, { status: 400 });
    }

    // Load private key from env
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json({ error: 'PRIVATE_KEY not set in environment variables.' }, { status: 500 });
    }

    const backendWallet = new ethers.Wallet(privateKey);

    const balanceAtDistribution = ethers.parseUnits('1000', 18); // 1000 tokens with 18 decimals

    const messageHash = ethers.solidityPackedKeccak256(
      ['address', 'uint256', 'uint256'],
      [userAddress, distributionIdNum, balanceAtDistribution]
    );

    const ethSignedMessageHash = ethers.keccak256(
      ethers.concat([
        ethers.toUtf8Bytes('\x19Ethereum Signed Message:\n32'),
        messageHash,
      ])
    );

    const signature = await backendWallet.signMessage(ethers.getBytes(messageHash));
    const recoveredSigner = ethers.verifyMessage(ethers.getBytes(messageHash), signature);
    const isValid = recoveredSigner === backendWallet.address;

    return NextResponse.json({
      backendAddress: backendWallet.address,
      userAddress,
      distributionId: distributionIdNum,
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
