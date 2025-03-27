# 🏠 LandLordToken (LND)

LandLordToken (LND) is an ERC-20 compatible smart contract deployed on Ethereum-compatible blockchains. It allows token holders (except the owner) to claim profits distributed by the owner based on their token holdings at the time of each distribution. A backend service is used to sign profit claims to ensure secure and verifiable reward distribution.

## 📦 Features

- ✅ ERC-20 token implementation using OpenZeppelin  
- ✅ Fixed initial supply with optional minting and burning  
- ✅ Owner can distribute profits to token holders  
- ✅ Secure, signature-based claim mechanism (ECDSA)  
- ✅ Backend address verification for trusted claims  

## 🔧 Tech Stack

- Solidity ^0.8.20  
- Hardhat  
- Ethers.js v6  
- OpenZeppelin Contracts  

---

## 🚀 Getting Started

### 📁 Project Setup

```bash
git clone https://github.com/your-username/landlord-token.git
cd landlord-token
npm install
```

### 🔨 Compile the Contract

```bash
npx hardhat compile
```

### 🔌 Start a Local Node

Launch a local Hardhat node in one terminal window:

```bash
npx hardhat node
```

This starts a local Ethereum network with pre-funded accounts.

### 🚀 Deploy the Contract Locally

In another terminal window, run:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

This command will compile the contract, deploy it on your local network, and output the deployed contract address.

---

## 🧪 Testing

Run tests with:

```bash
npx hardhat test
```

> 💡 Requires Node.js v20.x for compatibility with Hardhat and ethers.js v6.

---

## 📄 Contract Overview

- **Token Name:** `LandLord`  
- **Symbol:** `LND`  
- **Decimals:** 18  
- **Initial Supply:** 10¹⁴ LND tokens (minted to owner)  

---

## 💰 Profit Distribution Workflow

1. **Owner** initiates a profit distribution with a specified amount of LND tokens.
2. The smart contract stores the timestamp and excludes the owner's balance from the distribution pool.
3. A backend service calculates each user’s balance at distribution time and signs a claim message.
4. **Users** claim profits by submitting the signed message from the backend.
5. The smart contract verifies the signature, ensures the claim is valid and unclaimed, then transfers the calculated share to the user.

---

## 🔐 Security Considerations

- Signature verification prevents unauthorized claims.
- Backend key rotation possible via `setBackendAddress()` by the contract owner.
- Owner is excluded from claiming profits.
- Reentrancy not possible due to no external call during transfer (uses `transfer()`).

---

## 🧠 License

Licensed under the MIT License.
