import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-purple-700 mb-2">
            🚑 Token4Life
          </h1>
          <p className="text-lg text-gray-700">
            A Cardano-powered donor loyalty system revolutionizing blood and organ donation in Sri Lanka.
          </p>
          <div className="mt-4 text-sm text-gray-600">
            <p>👥 Developed by <strong className="text-purple-600">Team DOT</strong></p>
            <p>🏫 University of Vavuniya, Sri Lanka</p>
          </div>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">🚀 Challenge Category</h2>
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              🌍 Social Impact & Sustainability
            </h3>
            <p className="text-gray-700">
              Token4Life leverages the Cardano blockchain to ensure transparency, trust, and traceability in blood and organ donation. Our loyalty system rewards altruism while enhancing public health infrastructure.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">💡 Project Features</h2>
          <ul className="space-y-4">
            <li className="bg-white p-4 rounded shadow border-l-4 border-purple-400">
              ✅ Donor registration with wallet binding and SMS verification
            </li>
            <li className="bg-white p-4 rounded shadow border-l-4 border-purple-400">
              ✅ UTXO-based donation tracking on Cardano via Lucid
            </li>
            <li className="bg-white p-4 rounded shadow border-l-4 border-purple-400">
              ✅ Donor loyalty points and reputation system
            </li>
            {/* <li className="bg-white p-4 rounded shadow border-l-4 border-purple-400">
              ✅ Emergency alert & donation request broadcast via SMS gateway
            </li> */}
            <li className="bg-white p-4 rounded shadow border-l-4 border-purple-400">
              ✅ Admin dashboard with donor analytics and balance tracking
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">⚙️ Tech Stack</h2>
          <div className="bg-white p-5 rounded-lg shadow text-gray-800 space-y-2">
            <p>🔷 <strong>Blockchain:</strong> Cardano</p>
            <p>🛠️ <strong>Smart Contracts:</strong> Lucid (JS library)</p>
            <p>🌐 <strong>Backend:</strong> Node.js (Express + Prisma)</p>
            <p>📲 <strong>SMS Gateway:</strong> Integrated for real-time donor comms</p>
            <p>💡 <strong>Frontend:</strong> React + Tailwind CSS</p>
          </div>
        </section>

        <footer className="text-center mt-16 text-gray-500 text-sm">
          Made with ❤️ by Team DOT — University of Vavuniya, for the Cardano Innovation Challenge 2025
        </footer>
      </div>
    </div>
  );
}
