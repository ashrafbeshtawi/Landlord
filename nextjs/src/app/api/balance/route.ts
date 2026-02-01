import { ethers, Result } from 'ethers';
import { createSecureResponse, maskAddress, getErrorMessage } from '@/utils/api';

const LANDLORD_TOKEN_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function getDistribution(uint256 distributionId) external view returns (uint256 totalAmount, uint256 distributionDate, uint256 distributionBlock, uint256 tokensExcludingOwner)',
  'function getUnclaimedDistributions(address user) external view returns (tuple(uint256 id, uint256 totalAmount, uint256 distributionDate, uint256 distributionBlock, uint256 tokensExcludingOwner)[] memory)',
];

interface ProfitDistributionViewInterface {
  id: bigint;
  totalAmount: bigint;
  distributionDate: bigint;
  distributionBlock: bigint;
  tokensExcludingOwner: bigint;
}

type UnclaimedDistributionResult = Result & ProfitDistributionViewInterface;

interface DistributionWithShare {
  id: string;
  totalAmount: string;
  distributionDate: string;
  distributionBlock: string;
  tokensExcludingOwner: string;
  userBalanceAtDistributionBlock: string;
  userShare: string;
}

/**
 * Validates block number is reasonable
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

    // Don't allow blocks older than ~2 years (assuming ~12s blocks)
    const maxAge = 5256000;
    if (blockNumber < currentBlock - maxAge) {
      return { valid: false, error: 'Block number is too old' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Failed to validate block number' };
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userAddress = url.searchParams.get('userAddress');
    const blockParam = url.searchParams.get('block');

    if (!userAddress) {
      return createSecureResponse({ error: 'userAddress is required.' }, 400);
    }

    if (!ethers.isAddress(userAddress)) {
      return createSecureResponse({ error: 'Invalid userAddress format.' }, 400);
    }

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const rpcUrl = process.env.RPC_URL;

    if (!contractAddress || !rpcUrl) {
      console.error('Missing environment variables (NEXT_PUBLIC_CONTRACT_ADDRESS, RPC_URL)');
      return createSecureResponse({ error: 'Server configuration error.' }, 500);
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const landLordTokenContract = new ethers.Contract(contractAddress, LANDLORD_TOKEN_ABI, provider);

    let currentBlockTag: string | number = 'latest';
    if (blockParam) {
      const parsedBlock = parseInt(blockParam, 10);
      if (isNaN(parsedBlock) || parsedBlock < 0) {
        return createSecureResponse({ error: 'block must be a valid non-negative number if provided.' }, 400);
      }

      // Validate block is reasonable
      const blockValidation = await validateBlockNumber(provider, parsedBlock);
      if (!blockValidation.valid) {
        return createSecureResponse({ error: blockValidation.error || 'Invalid block number.' }, 400);
      }

      currentBlockTag = parsedBlock;
    }

    const currentBalance: bigint = await landLordTokenContract.balanceOf(userAddress, { blockTag: currentBlockTag });
    const unclaimedDistributionsRaw: UnclaimedDistributionResult[] = await landLordTokenContract.getUnclaimedDistributions(userAddress, { blockTag: currentBlockTag });

    const availableDistributionsWithShare: DistributionWithShare[] = [];

    for (const dist of unclaimedDistributionsRaw) {
      try {
        // Validate distribution block values
        const distBlock = Number(dist.distributionBlock);
        if (isNaN(distBlock) || distBlock < 0) {
          console.error(`Invalid distribution block for ID ${dist.id.toString()}`);
          continue;
        }

        const userBalanceAtDistributionBlock: bigint = await landLordTokenContract.balanceOf(
          userAddress,
          { blockTag: distBlock }
        );

        let userShare: bigint;
        if (dist.tokensExcludingOwner > BigInt(0)) {
          userShare = (userBalanceAtDistributionBlock * dist.totalAmount) / dist.tokensExcludingOwner;
        } else {
          userShare = BigInt(0);
        }

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
        // Log with masked address for privacy
        console.error(`Error processing unclaimed distribution ID ${dist.id.toString()} for ${maskAddress(userAddress)}:`, getErrorMessage(distErr));
      }
    }

    return createSecureResponse({
      balance: currentBalance.toString(),
      availableDistributions: availableDistributionsWithShare,
    });
  } catch (err: unknown) {
    console.error('Balance API Error:', getErrorMessage(err));
    return createSecureResponse({ error: 'Failed to fetch balance data.' }, 500);
  }
}
