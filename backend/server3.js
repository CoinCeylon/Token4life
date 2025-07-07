// server.js
import dotenv from 'dotenv';
dotenv.config();
// import prisma from './token/db/prismaClient.js';
import sendSms from './token/send_sms.js';
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import getDonorByPhone from './token/getmobil_num.js'; // Import the function to get donor by phone
import prisma from './token/db/prismaClient.js';
import { getLucidInstance } from './token/lib/lucid.js';
import { transferAmount }  from './token/transfer_amount.js';
import createWallet from './token/cerate_doner.js'
const app = express();
app.use(cors(), express.json());

function convertBigIntToString(obj) {
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(convertBigIntToString);
  if (obj !== null && typeof obj === 'object') {
    const res = {};
    for (const [key, value] of Object.entries(obj)) {
      res[key] = convertBigIntToString(value);
    }
    return res;
  }
  return obj;
}


const otpSessions = {};
async function checkAdminWallet() {
  const lucid = await getLucidInstance();
  // await lucid.selectWalletFromSeed(process.env.ADMIN_MNEMONIC);
  await lucid.selectWallet.fromPrivateKey(process.env.SYSTEM_PRIVATE_KEY);

//   console.log('🔑 Admin private key:', privateKey);
  const address = await lucid.wallet().address();
  console.log('🔗 Admin wallet address:', address);

  const utxos = await lucid.wallet().getUtxos();
  const totalLovelace = utxos.reduce((sum, utxo) => sum + (utxo.assets.lovelace ?? 0n), 0n);
  console.log(`💰 Admin wallet balance: ${totalLovelace / 1_000_000n} ADA`);
}

checkAdminWallet().catch(console.error);




// console.log(createWallet(94742550511));
// console.log(transferAmount(2000000,"addr_test1vperg7wz2tvexq4n0d6fant235msz6w8xhfkr2ppsguprvqadzv8x",process.env.SYSTEM_PRIVATE_KEY));
app.post('/auth/send-otp', async (req, res) => {
  const { phone } = req.body;

  if (!phone || !/^94\d{9}$/.test(phone)) {
    return res.status(400).json({ error: 'Valid Sri Lankan phone number required (e.g., 94712345678)' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const sessionId = uuidv4();

  otpSessions[sessionId] = {
    phone,
    otp,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
  };

  try {
const message = `Your Token4Life verification code is: ${otp}. It will expire in 5 minutes. Do not share this code with anyone.`;
    await sendSms(phone, message); // ✅ Use your utility

    return res.json({ sessionId, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('❌ OTP send error:', error.message);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
});

app.post('/auth/verify-otp', async (req, res) => {
  const { sessionId, otp, name } = req.body;
  const session = otpSessions[sessionId];
   if (!session || session.expires < Date.now()) {
    return res.status(401).json({ error: 'OTP expired or invalid session' });
  }

  if (session.otp !== otp) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  const phone = session.phone;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  if (!phone || typeof phone !== 'string' || !/^94\d{9}$/.test(phone)) {
    return res.status(400).json({ success: false, message: 'Invalid Sri Lankan phone number (e.g. 94712345678)' });
  }

  try {
    // ✅ 1. Create donor and wallet
    const { donor, utxos } = await createWallet({ name, phone });

    // ✅ 2. Fund the wallet with 4 ADA
    const transferAmountInLovelace = 4_000_000n;
    const txHash = await transferAmount(transferAmountInLovelace, donor.walletAddress, process.env.SYSTEM_PRIVATE_KEY);
    const welcomeMessage = `Welcome to Token4Life, ${donor.name}! Your wallet has been funded with 4 ADA. Thank you for joining our community.`;

    await sendSms(donor.phone, welcomeMessage);
    console.log(`📨 Welcome SMS sent to ${donor.phone}`);
    console.log(`✅ Funded ${donor.phone} at ${donor.walletAddress} with 4 ADA. TX: ${txHash}`);

    // ✅ 3. Respond
    return res.json({
      success: true,
      message: 'Wallet created and funded successfully',
      donor: {
        id: donor.id,
        name: donor.name,
        phone: donor.phone,
        walletAddress: donor.walletAddress,
      },
      txHash,
      utxos,
    });

  } catch (error) {
    console.error('❌ Error in /register:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create or fund wallet',
      error: error.message,
    });
  }
});


app.post('/transaction', async (req, res) => {


    
  const { phone, type, description ,amount } = req.body;

  // Validate input
  if (!phone || !/^94\d{9}$/.test(phone)) {
    return res.status(400).json({ success: false, message: 'Invalid Sri Lankan phone number' });
  }
  if (!type || (type !== 'blood' && type !== 'organ')) {
    return res.status(400).json({ success: false, message: 'Type must be "blood" or "organ"' });
  }
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Description is required' });
  }

  try {
    // Find donor by phone
    const donor = await getDonorByPhone(phone);

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }
    

    // For demonstration, let's transfer 2 ADA from admin to donor (or any logic you want)
let transferAmountInLovelace;
if (type === 'blood') {
  transferAmountInLovelace = 3_000_000n;  // 3 ADA
} else if (type === 'organ') {
  transferAmountInLovelace = 6_000_000n;  // 6 ADA
} else {
  // Default fallback or throw error if needed
  transferAmountInLovelace = 2_000_000n;  // fallback 2 ADA
}
    const txHash = await transferAmount(transferAmountInLovelace, donor.walletAddress, process.env.SYSTEM_PRIVATE_KEY);

    // After transfer, get donor's UTXOs from blockchain
    const lucid = await getLucidInstance();
    await lucid.selectWallet.fromPrivateKey(donor.privateKey);
    const utxos = await lucid.wallet().getUtxos();
    console.log(utxos);
    if (!utxos.length) {
  throw new Error("No UTXOs available to spend");
}
  // const utxos = await lucid.wallet().getUtxos();
  const totalLovelace = utxos.reduce((sum, utxo) => sum + (utxo.assets.lovelace ?? 0n), 0n);
   const balance =`${totalLovelace / 1_000_000n} ADA`
    const safeUtxos = convertBigIntToString(utxos);
    // Create DonationTransaction record
    const donationTransaction = await prisma.donationTransaction.create({
      data: {
        donorId: donor.id,
        type,
        description,
        utxos: safeUtxos, // Save UTXOs as JSON string
      },
    });

const message = `We sincerely thank you for your generous ${type} donation. ${description}. Your support is invaluable to us. As of now, your wallet balance is ${balance} . Thank you for making a difference!`;
    await sendSms(donor.phone, message);
    console.log(`📨 Thank-you SMS sent to ${donor.phone}`);
console.log('Donation transaction recorded:', donationTransaction);
    return res.json({
      success: true,
      message: 'Transaction successful and recorded',
      transaction: {
        id: donationTransaction.id,
        type: donationTransaction.type,
        description: donationTransaction.description,
        createdAt: donationTransaction.createdAt,
        txHash,
        safeUtxos,
      },
    });
  } catch (error) {
    console.error('❌ Error in /transaction:', error);
    return res.status(500).json({ success: false, message: 'Transaction failed', error: error.message });
  }
});


app.get('/donors', async (req, res) => {
  try {
    const donors = await prisma.donor.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        walletAddress: true,
        createdAt: true,
      },
    });

    return res.json({ success: true, donors });
  } catch (error) {
    console.error('❌ Error fetching donors:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch donors',
      error: error.message,
    });
  }
});


app.get('/transactions/:phone', async (req, res) => {
  const { phone } = req.params;

  if (!phone || !/^94\d{9}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Sri Lankan phone number format (e.g. 94712345678)',
    });
  }

  try {
    // Find the donor by phone number
    const donor = await prisma.donor.findUnique({
      where: { phone },
    });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found',
      });
    }

    // Get all transactions for the donor
    const transactions = await prisma.donationTransaction.findMany({
      where: { donorId: donor.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      donor: {
        name: donor.name,
        phone: donor.phone,
        walletAddress: donor.walletAddress,
      },
      transactions,
    });

  } catch (error) {
    console.error('❌ Error fetching transactions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message,
    });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Running on http://localhost:${PORT}`);
});
