// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as bip39 from 'bip39';

import prisma from './token/db/prismaClient.js';
import { getLucidInstance } from './token/lib/lucid.js';
import getSystemPolicyScript from './token/policyScript.js';
import waitForKoiosUtxo from './token/getUtxo.js';
import mintToken from './token/mintToken.js';
import generateWalletForPhone from './token/walletGenerator.js';
import fundWallet from './token/fundWallet.js';

const app = express();
app.use(cors(), express.json());

const otpSessions = {};

async function getPolicy(lucid) {
  return getSystemPolicyScript(lucid, process.env.SYSTEM_KEYHASH);
}

async function initAdmin() {
  const exists = await prisma.admin.findFirst();
  if (!exists) {
    const lucid = await getLucidInstance();


const mnemonic = bip39.generateMnemonic(256); // 24 words
console.log('🆕 New Mnemonic:', mnemonic);


    lucid.selectWalletFromSeed(process.env.ADMIN_MNEMONIC);
  const adminAddress = await lucid.wallet.address();
  console.log('Admin Address:', adminAddress);
    const policy = await getPolicy(lucid);
    // console.log('🛡️ Admin minting policy:', policy);

    await mintToken({
      walletAddress: process.env.SYSTEM_WALLET_ADDRESS,
      mnemonic: process.env.SYSTEM_MNEMONIC,
      mintingPolicy: policy,
      assetName: 'Token4LifeInit',
      amount: '1',
    });

    // Optionally create admin DB entry
    // await prisma.admin.create({
    //   data: {
    //     walletAddress: process.env.SYSTEM_WALLET_ADDRESS,
    //     mnemonic: process.env.SYSTEM_MNEMONIC,
    //     balance: 200_000_000,
    //   },
    // });
    console.log('✅ Admin initialized');
  }
}
initAdmin().catch(console.error);

// 🔐 OTP request
app.post('/auth/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const sid = uuidv4();
  otpSessions[sid] = { phone, otp, expires: Date.now() + 5 * 60 * 1000 };

  try {
    await axios.get('https://app.notify.lk/api/v1/send', {
      params: {
        user_id: process.env.NOTIFYLK_USER_ID,
        api_key: process.env.NOTIFYLK_API_KEY,
        sender_id: process.env.NOTIFYLK_SENDER_ID,
        to: phone,
        message: `🩸 Token4Life OTP: ${otp}`,
      },
    });
    res.json({ sessionId: sid });
  } catch (err) {
    console.error('❌ OTP error:', err.message);
    res.status(500).json({ error: 'OTP send failed' });
  }
});

// ✅ OTP verification and donor creation
app.post('/auth/verify-otp', async (req, res) => {
  const { sessionId, otp } = req.body;
  const sess = otpSessions[sessionId];
  if (!sess || sess.otp !== otp || sess.expires < Date.now()) {
    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }
  delete otpSessions[sessionId];

  try {
    let donor = await prisma.donor.findUnique({ where: { phone: sess.phone } });

    if (!donor) {
      const wallet = await generateWalletForPhone(sess.phone);
      await fundWallet(wallet.walletAddress);
      await waitForKoiosUtxo(wallet.walletAddress);

      const lucid = await getLucidInstance();
      const policy = await getPolicy(lucid);

      await mintToken({
        walletAddress: wallet.walletAddress,
        mnemonic: wallet.mnemonic,
        mintingPolicy: policy,
        assetName: 'Token4LifeWelcome',
        amount: '4',
      });

      donor = await prisma.donor.create({
        data: {
          phone: sess.phone,
          walletAddress: wallet.walletAddress,
          mnemonic: wallet.mnemonic,
          verified: true,
          points: 4,
          createdAt: new Date(),
        },
      });
    }

    const { mnemonic, ...safeDonor } = donor;
    res.json({ donor: safeDonor });
  } catch (err) {
    console.error('❌ Verify OTP error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🎁 Reward minting
app.post('/rewards/mint', async (req, res) => {
  const { phone, type } = req.body;

  const donor = await prisma.donor.findUnique({ where: { phone } });
  if (!donor) return res.status(404).json({ error: 'Donor not found' });

  const amount = type === 'blood' ? 2 : type === 'organ' ? 10 : 0;
  if (!amount) return res.status(400).json({ error: 'Invalid reward type' });

  try {
    const lucid = await getLucidInstance();
    const policy = await getPolicy(lucid);

    const result = await mintToken({
      walletAddress: donor.walletAddress,
      mnemonic: donor.mnemonic,
      mintingPolicy: policy,
      assetName: 'Token4LifeReward',
      amount: amount.toString(),
    });

    const updated = await prisma.donor.update({
      where: { phone },
      data: { points: donor.points + amount },
    });

    const { mnemonic, ...safeDonor } = updated;
    res.json({ result, donor: safeDonor });
  } catch (err) {
    console.error('❌ Mint reward error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🩺 Health check
app.get('/', (req, res) => res.send('🏥 Token4Life backend running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Running on http://localhost:${PORT}`);
});
