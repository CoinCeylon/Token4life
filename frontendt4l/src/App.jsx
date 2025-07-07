import { Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Donate from "./pages/Donate";
import Transactions from "./pages/Transactions";
import Home from "./pages/Home";  
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <nav className="flex justify-center gap-4 mb-6">
        <Link to="/register" className="text-red-600 font-semibold">Register</Link>
        <Link to="/donate" className="text-blue-600 font-semibold">Donaters</Link>
        {/* <Link to="/transactions" className="text-purple-600 font-semibold">Transactions</Link> */}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/transactions/:phone" element={<Transactions />} />
      </Routes>
    </div>
  );
}
