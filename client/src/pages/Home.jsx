import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Home() {
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [mode, setMode] = useState("immediate");
  const navigate = useNavigate();

  const startInterview = () => {
    if (!role.trim()) {
      alert("Please enter a job role to start the interview.");
      return;
    }
    navigate("/interview", { state: { role, company, mode } });
  };

  const goHome = () => {
    navigate("/"); // reloads landing page
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 text-white relative">
      
      {/* ✅ Header Component */}
      <Header />

      {/* ✅ Home Button (Top Right) */}
      <button
        onClick={goHome}
        className="absolute top-6 right-6 bg-white/20 text-white px-5 py-2 rounded-full border border-white/40 backdrop-blur-md hover:bg-white/30 transition"
      >
        🏠 Home
      </button>

      {/* ✅ Main Content */}
      <div className="flex-grow flex flex-col justify-center items-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-6xl bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 border border-white/30">
          
          {/* Left Section */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-extrabold mb-4 text-white drop-shadow-md">
              🎯 AI Interview Coach
            </h1>
            <p className="text-gray-100 text-lg leading-relaxed max-w-xl mx-auto md:mx-0 drop-shadow-sm">
              Prepare for your dream job with{" "}
              <span className="font-semibold text-yellow-200">AI-powered mock interviews</span>.  
              Get a structured, section-based interview with progress tracking and instant feedback.
            </p>
          </div>

          {/* Right Section - Form */}
          <div className="flex-1 w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center text-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Get Started</h2>

            <input
              type="text"
              placeholder="Job Role (e.g. Frontend Developer)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 mb-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <input
              type="text"
              placeholder="Company (optional)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-3 mb-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full px-4 py-3 mb-6 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="immediate">Correct after each answer</option>
              <option value="later">Correct at the end</option>
            </select>

            <button
              onClick={startInterview}
              className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition duration-200 shadow-md"
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
