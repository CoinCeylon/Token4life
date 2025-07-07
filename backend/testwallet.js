// const generateWalletForPhone = require('./token/walletGenerator');

// async function testGenerateWallet() {
//   try {
//     const wallet = await generateWalletForPhone('940742550511');
//     console.log('Wallet generated:', wallet);
//   } catch (error) {
//     console.error('Error generating wallet:', error);
//   }
// }


// async function testblockforest() {
//   try {
//     const wallet = await generateWalletForPhone('940742550511');
//     console.log('Wallet generated:', wallet);
//   } catch (error) {
//     console.error('Error generating wallet:', error);
//   }
// }
// const bip39 = require('bip39');



// const bip39 = require('bip39');
// const CardanoWasm = require('@emurgo/cardano-serialization-lib-nodejs');

// const mnemonic = bip39.generateMnemonic(); // ✔️ Always valid
// console.log('🧠 Generated Mnemonic:', mnemonic);

// if (!bip39.validateMnemonic(mnemonic)) {
//   throw new Error('❌ This should never happen');
// }

// const entropy = bip39.mnemonicToEntropy(mnemonic);
// const rootKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(Buffer.from(entropy, 'hex'), Buffer.from(''));
// const accountKey = rootKey
//   .derive(1852 | 0x80000000)
//   .derive(1815 | 0x80000000)
//   .derive(0 | 0x80000000);

// const utxoKey = accountKey.derive(0).derive(0);
// const keyHash = utxoKey.to_public().to_raw_key().hash().to_hex();

// console.log('🔑 SYSTEM_KEYHASH:', keyHash);

// const getSystemPolicyScript = require('./token/policyScript');
// const mintToken = require('./token/mintToken');

// (async () => {
//   const policyScript = getSystemPolicyScript(process.env.SYSTEM_KEYHASH);

//   const result = await mintToken({
//     walletAddress: 'addr_test1q...', // replace with a valid recipient
//     policyScript,
//     assetName: 'Token4LifeWelcome1',
//     amount: '1'
//   });

//   // This is your signed transaction!
//   const cborHex = result.cborHex;
//   console.log('🔑 Signed CBOR:', cborHex);
// })();


// const axios = require('axios');
// require('dotenv').config();

// async function submitTx(cborHex) {
//   const res = await axios.post(
//     'https://cardano-preview.blockfrost.io/api/v0/tx/submit',
//     Buffer.from(cborHex, 'hex'),
//     {
//       headers: {
//         'Content-Type': 'application/cbor',
//         'project_id': process.env.BLOCKFROST_API_KEY
//       }
//     }
//   );

//   return res.data; // TX hash
// }

// console.log(submitTx());
import mintAndSubmit from './token/mintAndSubmit.js';
(async () => {
  const result = await mintAndSubmit('94742550511'); // or use OTP-verified phone
  console.log('🧾 Onboarding Result:', result);
})();

// lucid.selectWalletFromSeed(process.env.ADMIN_MNEMONIC);
// const adminAddress = await lucid.wallet.address();
// console.log('Admin Address:', adminAddress);

// import { generateSeedPhrase } from "lucid-cardano";

// console.log(generateSeedPhrase());
