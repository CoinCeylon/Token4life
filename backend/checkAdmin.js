// checkAdmin.js
import dotenv from 'dotenv';
dotenv.config();
import { generatePrivateKey } from "@lucid-evolution/lucid";

// const privateKey = generatePrivateKey(); // Bech32 encoded private key
// console.log(privateKey);
import { getLucidInstance } from './token/lib/lucid.js';

async function checkAdminWallet() {
  const lucid = await getLucidInstance();
  // await lucid.selectWalletFromSeed(process.env.ADMIN_MNEMONIC);
  await lucid.selectWallet.fromPrivateKey(process.env.SYSTEM_PRIVATE_KEY);

  console.log('🔑 Admin private key:', privateKey);
  const address = await lucid.wallet().address();
  console.log('🔗 Admin wallet address:', address);

  const utxos = await lucid.wallet().getUtxos();
  const totalLovelace = utxos.reduce((sum, utxo) => sum + (utxo.assets.lovelace ?? 0n), 0n);
  console.log(`💰 Admin wallet balance: ${totalLovelace / 1_000_000n} ADA`);
}

checkAdminWallet().catch(console.error);
