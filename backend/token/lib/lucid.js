import { Lucid, Blockfrost } from "@lucid-evolution/lucid";
// let lucid = null;

export async function getLucidInstance() {
//   if (lucid) return lucid;

const apiKey = process.env.BLOCKFROST_API_KEY; // your Preview API key
  const previewBlockfrostUrl = "https://cardano-preview.blockfrost.io/api/v0";

  const lucid = await Lucid(
    new Blockfrost(previewBlockfrostUrl, apiKey),
    "Preview" // Specify the Preview network here
  );
  console.log(lucid);
  return lucid;
}
