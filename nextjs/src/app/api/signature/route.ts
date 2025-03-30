import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

export async function GET(request: Request) {
  try {
    // Get query parameters from the request
    const url = new URL(request.url);
    const userAddress = url.searchParams.get('userAddress');
    const distributionId = url.searchParams.get('distributionId');
    
    // Check if required parameters are provided
    if (!userAddress || !distributionId) {
      return NextResponse.json({ error: 'userAddress and distributionId are required.' }, { status: 400 });
    }

    // Convert distributionId to number if necessary
    const distributionIdNum = parseInt(distributionId, 10);
    if (isNaN(distributionIdNum)) {
      return NextResponse.json({ error: 'distributionId must be a valid number.' }, { status: 400 });
    }

    // ⚠️ Never use real private keys in production code
    const privateKey = '0x1234567890123456789012345678901234567890123456789012345678901234';
    const backendWallet = new ethers.Wallet(privateKey);

    // Example value for balanceAtDistribution
    const balanceAtDistribution = 1000;

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
      balanceAtDistribution,
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
