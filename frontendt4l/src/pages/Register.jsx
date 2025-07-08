import { useState } from "react";
import api from '../api';

const SendOtp = () => {
  const [phone, setPhone] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [numsessionId, setNumsessionId] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [verifyMsg, setVerifyMsg] = useState('');


   const [type, setType] = useState('blood');
  const [description, setDescription] = useState('');
  const [transactionMsg, setTransactionMsg] = useState('');
const handleSubmitTransaction = async () => {
    try {
      const res = await api.post('/transaction', {
        phone,
        type,
        description,
      });

      const { message, transaction } = res.data;
      setTransactionMsg(`✅ ${message}\nTX Hash: ${transaction.txHash}`);
    } catch (error) {
      if (error.response) {
        setTransactionMsg(`❌ ${error.response.data.message}`);
      } else {
        setTransactionMsg('❌ Failed to submit transaction.');
      }
    }
  };
  const handleSendOtp = async () => {
    try {
      const res = await api.post('/num/send-otp', { phone });
      const { sessionId, message } = res.data;

      setNumsessionId(sessionId);
      setResponseMsg(`✅ ${message}. Session ID stored.`);
    } catch (error) {
      if (error.response) {
        setResponseMsg(`❌ Error: ${error.response.data.error}`);
      } else {
        setResponseMsg('❌ Failed to send request.');
      }
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await api.post('/num/verify-otp', {
        sessionId: numsessionId,
        otp,
        name,
      });

      const { donor, message, txHash } = res.data;
      setVerifyMsg(`🎉 ${message}\nWallet: ${donor.walletAddress}\nTX: ${txHash}`);
    } catch (error) {
      if (error.response) {
        setVerifyMsg(`❌ Error: ${error.response.data.message || error.response.data.error}`);
      } else {
        setVerifyMsg('❌ Failed to verify OTP.');
      }
    }
  };

  return (
    <>
   <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 bg-white shadow rounded-lg p-8">
        {/* Left Box - OTP + Verify */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-red-600">🔐 Send OTP & Create Wallet</h2>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter phone (e.g., 94712345678)"
              className="w-full px-4 py-2 border rounded-md"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-xs text-gray-500">Use format: 94XXXXXXXXX (e.g., 94743559511)</p>
            <button
              onClick={handleSendOtp}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send OTP
            </button>
            <p className="text-sm text-gray-600">{responseMsg}</p>

            {numsessionId && (
              <div className="space-y-3 pt-6">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 border rounded-md"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button
                  onClick={handleVerifyOtp}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Verify & Create Wallet
                </button>
                <pre className="text-sm bg-gray-100 p-2 rounded">{verifyMsg}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Box - Transaction Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-green-700">❤️ Record Donation</h2>

          
            <div className="space-y-4">
                    <input
              type="text"
              placeholder="Enter phone (e.g., 94712345678)"
              className="w-full px-4 py-2 border rounded-md"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-xs text-gray-500">Use format: 94XXXXXXXXX (e.g., 94743559511)</p>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="blood">Blood</option>
                <option value="organ">Organ</option>
              </select>

              <input
                type="text"
                placeholder="Enter description"
                className="w-full px-4 py-2 border rounded-md"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button
                onClick={handleSubmitTransaction}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Submit Transaction
              </button>

              <pre className="text-sm bg-gray-100 p-2 rounded">{transactionMsg}</pre>
            </div>
            <p className="text-gray-500">Please verify OTP and create wallet before recording a donation.</p>
        </div>
      </div>
    </div>

        </>

  );
};

export default SendOtp;
