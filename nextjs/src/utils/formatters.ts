import { ethers } from 'ethers';

export function formatTokenAmount(amount: string, decimals: number = 18): string {
  try {
    const formatted = ethers.formatUnits(amount, decimals);
    const num = parseFloat(formatted);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(4);
  } catch {
    return '0';
  }
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(timestamp: string | number): string {
  let date: Date;

  // Handle ISO string (from API) or Unix timestamp
  if (typeof timestamp === 'string' && timestamp.includes('T')) {
    // ISO string format: "2024-01-15T10:30:00.000Z"
    date = new Date(timestamp);
  } else {
    // Unix timestamp (seconds)
    date = new Date(Number(timestamp) * 1000);
  }

  if (isNaN(date.getTime())) {
    return 'Unknown';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTxHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}
