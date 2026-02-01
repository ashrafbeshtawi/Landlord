export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export const TOAST_DURATION = {
  success: 5000,
  error: 7000,
  pending: null, // No auto-dismiss for pending
} as const;

// Formatting thresholds
export const FORMAT_THRESHOLDS = {
  MILLION: 1_000_000,
  THOUSAND: 1_000,
} as const;

// Chain configurations for explorer URLs
export const CHAIN_EXPLORERS: Record<number, { name: string; url: string }> = {
  1: { name: 'Etherscan', url: 'https://etherscan.io' },
  5: { name: 'Goerli Etherscan', url: 'https://goerli.etherscan.io' },
  11155111: { name: 'Sepolia Etherscan', url: 'https://sepolia.etherscan.io' },
  56: { name: 'BscScan', url: 'https://bscscan.com' },
  97: { name: 'BscScan Testnet', url: 'https://testnet.bscscan.com' },
  137: { name: 'Polygonscan', url: 'https://polygonscan.com' },
  80001: { name: 'Mumbai Polygonscan', url: 'https://mumbai.polygonscan.com' },
  42161: { name: 'Arbiscan', url: 'https://arbiscan.io' },
  10: { name: 'Optimistic Etherscan', url: 'https://optimistic.etherscan.io' },
  43114: { name: 'Snowtrace', url: 'https://snowtrace.io' },
  250: { name: 'FTMScan', url: 'https://ftmscan.com' },
  31337: { name: 'Local', url: '' }, // Hardhat local
} as const;

// Default to BSC if chain is unknown
export const DEFAULT_CHAIN_ID = 56;

/**
 * Gets the explorer URL for a given chain ID
 */
export function getExplorerUrl(chainId: number | null): string {
  if (!chainId) return CHAIN_EXPLORERS[DEFAULT_CHAIN_ID].url;
  return CHAIN_EXPLORERS[chainId]?.url || CHAIN_EXPLORERS[DEFAULT_CHAIN_ID].url;
}

/**
 * Gets the transaction URL for a given chain and hash
 */
export function getTxUrl(chainId: number | null, txHash: string): string {
  const baseUrl = getExplorerUrl(chainId);
  if (!baseUrl) return '';
  return `${baseUrl}/tx/${txHash}`;
}
