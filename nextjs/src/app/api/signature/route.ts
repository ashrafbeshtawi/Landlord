import { ethers } from 'ethers';
import { createSecureResponse, parseJsonBody, maskAddress, getErrorMessage } from '@/utils/api';

const ERC20_ABI = ['function balanceOf(address account) external view returns (uint256)'];

interface SignatureRequestBody {
  userAddress: string;
  distributionId: string | number;
  balanceAtDistribution: string;
  distributionBlock: string | number;
  ownershipSignature: string;
  nonce: string;
}

/**
 * Verifies that the requester owns the wallet address by checking their signature
 */
async function verifyOwnership(
  userAddress: string,
  nonce: string,
  ownershipSignature: string
): Promise<boolean> {
  try {
    const message = `Verify ownership for LandLord claim\nAddress: ${userAddress}\nNonce: ${nonce}`;
    const recoveredAddress = ethers.verifyMessage(message, ownershipSignature);
    return recoveredAddress.toLowerCase() === userAddress.toLowerCase();
  } catch {
    return false;
  }
}

/**
 * Validates block number is reasonable (not in future, not too old)
 */
async function validateBlockNumber(
  provider: ethers.JsonRpcProvider,
  blockNumber: number
): Promise<{ valid: boolean; error?: string }> {
  try {
    const currentBlock = await provider.getBlockNumber();

    if (blockNumber > currentBlock) {
      return { valid: false, error: 'Block number is in the future' };
    }

    // Don't allow blocks older than ~2 years (assuming ~3s blocks on BSC)
    const maxAge = 21024000;
    if (blockNumber < currentBlock - maxAge) {
      return { valid: false, error: 'Block number is too old' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Failed to validate block number' };
  }
}

export async function POST(request: Request) {
  try {
    const { data: body, error: parseError } = await parseJsonBody<SignatureRequestBody>(request);

    if (parseError || !body) {
      return createSecureResponse({ error: parseError || 'Invalid request body.' }, 400);
    }

    const {
      userAddress,
      distributionId,
      balanceAtDistribution,
      distributionBlock,
      ownershipSignature,
      nonce,
    } = body;

    // Validate required fields
    if (!userAddress || distributionId === undefined || !balanceAtDistribution || !distributionBlock) {
      return createSecureResponse({ error: 'Missing required parameters.' }, 400);
    }

    if (!ownershipSignature || !nonce) {
      return createSecureResponse(
        { error: 'Ownership verification required. Provide ownershipSignature and nonce.' },
        400
      );
    }

    if (!ethers.isAddress(userAddress)) {
      return createSecureResponse({ error: 'Invalid address format.' }, 400);
    }

    // Verify the requester owns this wallet
    const isOwner = await verifyOwnership(userAddress, nonce, ownershipSignature);
    if (!isOwner) {
      return createSecureResponse({ error: 'Ownership verification failed.' }, 403);
    }

    const distributionIdNum = parseInt(String(distributionId), 10);
    if (isNaN(distributionIdNum) || distributionIdNum < 0) {
      return createSecureResponse({ error: 'Invalid distribution ID.' }, 400);
    }

    const blockNum = parseInt(String(distributionBlock), 10);
    if (isNaN(blockNum) || blockNum < 0) {
      return createSecureResponse({ error: 'Invalid block number.' }, 400);
    }

    // Load environment variables
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const rpcUrl = process.env.RPC_URL;

    if (!privateKey || !contractAddress || !rpcUrl) {
      console.error('Missing required environment variables for signature generation');
      return createSecureResponse({ error: 'Server configuration error.' }, 500);
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const backendWallet = new ethers.Wallet(privateKey, provider);
    const tokenContract = new ethers.Contract(contractAddress, ERC20_ABI, provider);

    // Validate block is reasonable
    const blockValidation = await validateBlockNumber(provider, blockNum);
    if (!blockValidation.valid) {
      return createSecureResponse({ error: blockValidation.error || 'Invalid block number.' }, 400);
    }

    // Verify the balance on-chain - DO NOT trust user input
    const actualBalance = await tokenContract.balanceOf(userAddress, { blockTag: blockNum });
    const providedBalance = BigInt(balanceAtDistribution);

    if (actualBalance !== providedBalance) {
      console.warn(
        `Balance mismatch for ${maskAddress(userAddress)}: provided ${providedBalance}, actual ${actualBalance}`
      );
      return createSecureResponse({ error: 'Balance verification failed.' }, 400);
    }

    // Generate the signature
    const messageHash = ethers.solidityPackedKeccak256(
      ['address', 'uint256', 'uint256'],
      [userAddress, distributionIdNum, actualBalance]
    );

    const signature = await backendWallet.signMessage(ethers.getBytes(messageHash));

    return createSecureResponse({ signature });
  } catch (err: unknown) {
    console.error('Signature API error:', getErrorMessage(err));
    return createSecureResponse({ error: 'Failed to generate signature.' }, 500);
  }
}
