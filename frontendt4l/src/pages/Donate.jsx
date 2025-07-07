import { useEffect, useState } from "react";
import api from '../api';
import { Link } from "react-router-dom";
export default function DonorCards() {
  const [donors, setDonors] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDonors() {
      try {
        const res = await api.get("/donors");
        if (res.data.success) {
          setDonors(res.data.donors);
          setMessage(""); // Clear any previous error
        } else {
          setMessage("Failed to load donors.");
        }
      } catch (error) {
        setMessage("Error fetching donors.");
        console.error(error);
      } finally {
        setLoading(false); // Always turn off loading once done
      }
    }
    loadDonors();
  }, []);

  if (loading) return <p>Loading donors...</p>;

  if (message) return <p className="text-red-500">{message}</p>;

  return (
   <div className="max-w-4xl mx-auto p-6">
  <h1 className="text-3xl font-extrabold mb-6 text-blue-700 tracking-wide">
    Registered Donors
  </h1>
  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-3">
    {donors.map((donor) => (
                 <Link to={`/transactions/${donor.phone}`} className="text-blue-600 ">

      <div
        key={donor.id}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg p-6 hover:scale-[1.03] transform transition-transform duration-300"
      >
        <h2 className="text-xl font-semibold mb-2 tracking-wide">{donor.name}</h2>
        <p className="text-2xl font-bold opacity-90 mb-1 flex items-center gap-2">
          <span role="img" aria-label="phone">📱</span> {donor.phone}
        </p>
        <p className="text-xl font-extrabold opacity-80 break-all mb-3 flex items-center gap-2">
          <span role="img" aria-label="wallet">💳</span> {donor.walletAddress}
        </p>
        <p className="text-3xl opacity-70 italic tracking-wider">
          Registered on: {new Date(donor.createdAt).toLocaleDateString()}
        </p>
    
      </div></Link>
    ))}
  </div>
</div>
  );
}
