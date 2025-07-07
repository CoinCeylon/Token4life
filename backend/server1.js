import dotenv from 'dotenv';
dotenv.config();
import { Lucid, Blockfrost } from "lucid-cardano";
import { randomBytes } from "crypto";

/**
 * Generates a new Cardano wallet using Lucid.
 * @returns {Promise<{ privateKey: string, address: string }>}
 */
export async function createWallet() {
  const lucid = await Lucid.new(
    new Blockfrost("https://cardano-preview.blockfrost.io/api/v0/", process.env.BLOCKFROST_API_KEY),
    "Preview"
  );

  // Generate a random 32-byte private key
  const privateKeyBytes = randomBytes(32);
  const privateKeyHex = Buffer.from(privateKeyBytes).toString("hex");

  // Import the private key into Lucid
  lucid.selectWalletFromPrivateKey(privateKeyHex);

  // Get the address (bech32)
  const address = await lucid.wallet.address();

  return {
    privateKey: privateKeyHex,
    address
  };
}

// Example usage:
createWallet()
  .then(({ privateKey, address }) => {
    console.log("Private Key (hex):", privateKey);
    console.log("Address:", address);
  })
  .catch(console.error);