import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function DonorDashboard() {
  const { phone } = useParams();
  const [donor, setDonor] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Move this OUTSIDE useEffect
  function calculateBalance(transactions) {
    let totalLovelace = 0;

    transactions.forEach((tx) => {
      if (Array.isArray(tx.utxos)) {
        tx.utxos.forEach((utxo) => {
          const lovelace = parseInt(utxo.assets?.lovelace || "0", 10);
          totalLovelace += lovelace;
        });
      }
    });

    return totalLovelace / 1_000_000; // Convert to ADA
  }

  useEffect(() => {
    if (!phone) return;

    if (!/^94\d{9}$/.test(phone)) {
      setMessage("Invalid Sri Lankan phone number format (e.g. 94712345678)");
      setDonor(null);
      setTransactions([]);
      return;
    }

    async function fetchTransactions() {
      setLoading(true);
      setMessage("");
      try {
        const res = await api.get(`/transactions/${phone}`);
        if (res.data.success) {
          setDonor(res.data.donor);
          setTransactions(res.data.transactions);
        } else {
          setMessage(res.data.message || "Failed to fetch transactions");
        }
      } catch (error) {
        setMessage("Error fetching transactions");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [phone]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {donor && (
        <div className="mb-6 p-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-1">{donor.name}</h2>
          <p>📱 {donor.phone}</p>
          <p className="break-all mb-2">💳 {donor.walletAddress}</p>
          <p className="text-lg font-semibold mt-2">
            🔐 Current Balance:{" "}
            <span className="text-green-300">
              {calculateBalance(transactions).toFixed(6)} ADA
            </span>
          </p>
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-700 mb-4">Transactions</h3>

      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="mb-6 p-4 bg-white shadow-md rounded border border-gray-200"
        >
          <p><strong>Type:</strong> {tx.type}</p>
          <p><strong>Description:</strong> {tx.description}</p>
          <p><strong>Date:</strong> {new Date(tx.createdAt).toLocaleString()}</p>

          <div className="mt-4">
            <p className="font-medium text-gray-600 mb-2">🔗 UTXOs:</p>
            <div className="space-y-2">
              {Array.isArray(tx.utxos) ? (
                tx.utxos.map((utxo, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-100 rounded text-sm border"
                  >
                    <p><strong>TxHash:</strong> {utxo.txHash}</p>
                    <p><strong>Output Index:</strong> {utxo.outputIndex}</p>
                    <p><strong>Address:</strong> {utxo.address}</p>
                    <p>
                      <strong>Amount:</strong>{" "}
                      {parseInt(utxo.assets.lovelace, 10) / 1_000_000} ADA
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-red-500 text-sm">⚠ Invalid UTXO format</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
