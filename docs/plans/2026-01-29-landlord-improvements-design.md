# LandLord Token Improvements Design

## Overview

This document outlines the design for four improvements to the LandLord Token project:

1. Smart contract security review and fixes
2. Minting restriction (3% quarterly rolling window)
3. Frontend refactor with best practices
4. Collect Profit implementation (individual + batch claiming)

---

## 1. Smart Contract Security Review

### Critical Issues

1. **Profit transfer from owner without approval**
   - `claimProfit()` calls `_transfer(owner(), msg.sender, userShare)` but owner may not have sufficient balance
   - Will revert if owner doesn't hold enough tokens
   - **Mitigation**: Document requirement that owner must maintain sufficient balance for distributions

2. **No validation of `balanceAtDistribution` against actual historical balance**
   - Contract trusts backend signature entirely
   - If backend is compromised, arbitrary amounts can be claimed
   - **Mitigation**: Accept current design as backend is trusted; consider on-chain balance snapshots for future versions

### Medium Issues

3. **Unrestricted minting** - Will be fixed with 3% quarterly restriction (see Section 2)

4. **`getUnclaimedDistributions` gas risk**
   - O(n) loop over all distributions
   - Could timeout with many distributions
   - **Mitigation**: Acceptable for current scale; consider pagination for future versions

### Low Issues

5. **No events for minting**
   - `generateTokensForRealEstatePurchase` doesn't emit an event
   - **Fix**: Add `TokensMinted` event

6. **Backend address is single point of failure**
   - No multi-sig or timelock for changing it
   - **Mitigation**: Acceptable for current stage; consider multi-sig governance for future

---

## 2. Minting Restriction (3% Quarterly Rolling Window)

### New State Variables

```solidity
uint256 public lastMintTimestamp;
uint256 public constant MINT_INTERVAL = 90 days;
uint256 public constant MAX_MINT_PERCENTAGE = 3;
```

### New Event

```solidity
event TokensMinted(address indexed to, uint256 amount, uint256 timestamp);
```

### Modified Function

```solidity
function generateTokensForRealEstatePurchase(uint256 amount) public onlyOwner {
    require(
        lastMintTimestamp == 0 || block.timestamp >= lastMintTimestamp + MINT_INTERVAL,
        "Must wait 90 days between mints"
    );

    uint256 maxMintAmount = (totalSupply() * MAX_MINT_PERCENTAGE) / 100;
    require(amount <= maxMintAmount, "Minting amount exceeds 3% of total supply");

    lastMintTimestamp = block.timestamp;
    _mint(owner(), amount);

    emit TokensMinted(owner(), amount, block.timestamp);
}
```

### Behavior

- First mint: Allowed immediately (no prior timestamp)
- Subsequent mints: Must wait 90 days from last mint
- Each mint: Max 3% of current total supply at time of minting
- Emits event for transparency

---

## 3. Frontend Refactor

### New File Structure

```
src/
├── components/
│   ├── common/
│   │   ├── LoadingSpinner.tsx
│   │   └── Toast.tsx
│   ├── wallet/
│   │   └── WalletConnectButton.tsx
│   ├── holder/
│   │   ├── HolderPanel.tsx
│   │   ├── DistributionCard.tsx
│   │   └── ClaimAllButton.tsx
│   └── actions/
│       └── ERC20Actions.tsx
├── hooks/
│   ├── useContract.ts
│   ├── useWallet.ts
│   ├── useDistributions.ts
│   └── useToast.ts
├── types/
│   └── index.ts
├── utils/
│   ├── formatters.ts
│   └── constants.ts
└── app/
    └── api/
        └── signature/
            └── route.ts
```

### Improvements Summary

| Area | Current | Improved |
|------|---------|----------|
| Error handling | `alert()` calls | Toast notifications with context |
| Loading states | Basic text | Spinner + disabled buttons + transaction tracking |
| Type safety | Inline interfaces | Centralized types in `types/index.ts` |
| Contract logic | Duplicated in components | Extracted to `useContract` hook |
| API calls | Inline fetch | Dedicated hooks with error handling |

### Custom Hooks

**useContract.ts**
- Returns contract instance with signer
- Handles MetaMask connection errors
- Memoized to prevent unnecessary re-instantiation

**useDistributions.ts**
- Fetches available distributions from `/api/balance`
- Returns loading, error, and data states
- Auto-refreshes after successful claims

**useToast.ts**
- Manages toast notification state
- Supports success, error, and pending variants
- Auto-dismiss with configurable duration

### Type Definitions (`types/index.ts`)

```typescript
export interface Distribution {
  id: string;
  totalAmount: string;
  distributionDate: string;
  distributionBlock: string;
  tokensExcludingOwner: string;
  userBalanceAtDistributionBlock: string;
  userShare: string;
}

export interface ClaimResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export type ToastType = 'success' | 'error' | 'pending';

export interface ToastState {
  open: boolean;
  message: string;
  type: ToastType;
}
```

---

## 4. Collect Profit Implementation

### API Changes

**Fix `/api/signature/route.ts`** - Add POST handler:

```typescript
export async function POST(request: Request) {
  const { userAddress, distributionId, balanceAtDistribution } = await request.json();

  // Validate required fields
  if (!userAddress || distributionId === undefined || !balanceAtDistribution) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Sign and return signature
  // ... existing signing logic

  return NextResponse.json({ signature });
}
```

### Individual Claim Flow

1. User clicks "Collect" on distribution card
2. Show loading spinner on that card
3. POST `/api/signature` with distribution data
4. Call `contract.claimProfit(id, balance, signature)`
5. Show pending toast "Claiming profit..."
6. Wait for transaction confirmation
7. Show success toast with TX hash
8. Remove distribution from list
9. Refresh balance

### Batch "Claim All" Flow

1. User clicks "Claim All Profits" button
2. Show loading overlay on entire panel
3. For each unclaimed distribution:
   - Fetch signature from API
   - Call `contract.claimProfit()`
   - Update progress: "Claiming 2 of 5..."
4. Show summary toast: "Claimed 5 distributions!"
5. Refresh balance and clear list

### UI Components

**DistributionCard.tsx**
- Displays distribution details (amount, date, share)
- "Collect" button with loading state
- Disabled while another claim is processing

**ClaimAllButton.tsx**
- Appears when 2+ distributions available
- Shows count badge: "Claim All (5)"
- Progress indicator during batch claim
- Disabled if any individual claim is processing

---

## Implementation Order

1. Smart contract changes (minting restriction + event)
2. Deploy/test contract changes
3. Frontend types and utilities
4. Custom hooks
5. Common components (Toast, LoadingSpinner)
6. API POST handler fix
7. DistributionCard component
8. ClaimAllButton component
9. Refactored HolderPanel
10. Refactored ERC20Actions
11. Integration testing

---

## Files to Modify

### Smart Contract
- `web3/contracts/LandLordToken.sol`

### Frontend - New Files
- `src/types/index.ts`
- `src/utils/formatters.ts`
- `src/utils/constants.ts`
- `src/hooks/useContract.ts`
- `src/hooks/useWallet.ts`
- `src/hooks/useDistributions.ts`
- `src/hooks/useToast.ts`
- `src/components/common/LoadingSpinner.tsx`
- `src/components/common/Toast.tsx`
- `src/components/holder/DistributionCard.tsx`
- `src/components/holder/ClaimAllButton.tsx`

### Frontend - Modified Files
- `src/app/api/signature/route.ts` (add POST handler)
- `src/components/HolderPanel.tsx` (refactor)
- `src/components/ERC20Actions.tsx` (refactor)
