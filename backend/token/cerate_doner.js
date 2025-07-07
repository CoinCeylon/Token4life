import { generatePrivateKey } from "@lucid-evolution/lucid";
const { getLucidInstance } = await import('./lib/lucid.js');
import prisma from './db/prismaClient.js';

function validatePhone(phone) {
  const sriLankaPhoneRegex = /^94\d{9}$/;
  if (!phone || !sriLankaPhoneRegex.test(phone)) {
    throw new Error("Invalid Sri Lankan phone number. Format must be like 94712345678.");
  }
}


export default async function createWallet({ name, phone }) {
  validatePhone(phone);

  const lucid = await getLucidInstance();

  const existingDonor = await prisma.donor.findUnique({
    where: { phone },
  });

  if (existingDonor) {
    throw new Error("Phone number already registered");
  }

  // Generate a new private key
  const privateKey = generatePrivateKey();
  console.log('🔑 New private key:', privateKey);

  // Load wallet from the generated private key
  await lucid.selectWallet.fromPrivateKey(privateKey);

  // Get wallet address
  const address = await lucid.wallet().address();
  console.log('🔗 New wallet address:', address);

  // Get initial UTXOs (should be empty)
  const utxos = await lucid.wallet().getUtxos();
  console.log('💰 UTXOs:', utxos);

  // Save new donor to database
  const newDonor = await prisma.donor.create({
    data: {
      name,
      phone,
      privateKey,
      walletAddress: address,
    },
  });

  return {
    donor: newDonor,
    utxos,
  };
}
