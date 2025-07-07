// import prisma from './db/prismaClient.js';
import prisma from './db/prismaClient.js';

/**
 * Finds a donor by phone number.
 * @param {string} phone - Sri Lankan mobile number (e.g. 94712345678)
 * @returns {Promise<object>} Donor details including privateKey and walletAddress
 * @throws {Error} If phone invalid or donor not found
 */
export default async function getDonorByPhone(phone) {
  if (!/^94\d{9}$/.test(phone)) {
    throw new Error('Invalid Sri Lankan phone number. Format must be like 94712345678.');
  }

  const donor = await prisma.donor.findUnique({
    where: { phone },
  });

  if (!donor) {
    throw new Error('Donor not found for the provided phone number.');
  }

  return {
    id: donor.id,
    name: donor.name,
    phone: donor.phone,
    walletAddress: donor.walletAddress,
    privateKey: donor.privateKey,
    createdAt: donor.createdAt,
  };
}
