import { ethers } from 'ethers';
import { FORMAT_THRESHOLDS } from './constants';

export function formatTokenAmount(amount: string, decimals: number = 18): string {
  try {
    const formatted = ethers.formatUnits(amount, decimals);
    const num = parseFloat(formatted);

    if (num >= FORMAT_THRESHOLDS.MILLION) {
      return (num / FORMAT_THRESHOLDS.MILLION).toFixed(2) + 'M';
    }
    if (num >= FORMAT_THRESHOLDS.THOUSAND) {
      return (num / FORMAT_THRESHOLDS.THOUSAND).toFixed(2) + 'K';
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
