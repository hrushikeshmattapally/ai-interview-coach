import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 sm:px-6">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl sm:text-2xl font-bold text-gray-900 cursor-pointer"
        >
          AI Tools Hub
        </h1>
        <nav className="flex gap-4 sm:gap-6 text-sm sm:text-base">
          <button
            onClick={() => navigate("/")}
            className="text-gray-800 hover:text-purple-600 transition"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/home")}
            className="text-gray-800 hover:text-blue-600 transition"
          >
            Interview
          </button>
          <button
            onClick={() => navigate("/study-planner")}
            className="text-gray-800 hover:text-green-600 transition"
          >
            Study Planner
          </button>
          <button
            onClick={() => navigate("/mcq-quiz")}
            className="text-gray-800 hover:text-orange-600 transition"
          >
            MCQ Quiz
          </button>
        </nav>
      </div>
    </header>
  );
}
