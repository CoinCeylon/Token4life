import { generatePrivateKey } from "@lucid-evolution/lucid";
const { getLucidInstance } = await import('./lib/lucid.js');

export async function transferAmount(amount, address, privateKey) {
  try {
    const lucid = await getLucidInstance();
    await lucid.selectWallet.fromPrivateKey(privateKey);

    const tx = await lucid
      .newTx()
      .pay.ToAddress(address, { lovelace: BigInt(amount) })
      .complete();

 const signedTx = await tx.sign.withWallet().complete();
const txHash = await signedTx.submit();

    console.log('📤 TX submitted with hash:', txHash);
    return txHash;

  } catch (error) {
    console.error('❌ Transfer failed:', error.message);
    throw error;
  }
}
