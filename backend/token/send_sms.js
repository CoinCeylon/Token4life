// token/utils/sendSms.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Sends an SMS using Notify.lk API
 * @param {string} phone - Recipient's phone number (e.g., 94712345678)
 * @param {string} message - Message to send
 * @returns {Promise<void>}
 */
export default async function sendSms(phone, message) {
  try {
    const response = await axios.get('https://app.notify.lk/api/v1/send', {
      params: {
        user_id: process.env.NOTIFYLK_USER_ID,
        api_key: process.env.NOTIFYLK_API_KEY,
        sender_id: process.env.NOTIFYLK_SENDER_ID,
        to: phone,
        message,
      },
    });

    if (response.data.status !== 'success') {
      console.warn('⚠️ Notify.lk returned non-success:', response.data);
      throw new Error('Failed to send SMS via Notify.lk');
    }

    console.log(`📨 SMS sent to ${phone}: ${message}`);
  } catch (error) {
    console.error('❌ Error sending SMS:', error.message);
    throw new Error('SMS sending failed');
  }
}
