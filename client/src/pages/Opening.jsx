import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLaptopCode, FaCalendarAlt, FaQuestionCircle } from "react-icons/fa";
import myImage from "../assets/myimage.jpg"; // ✅ your local image
import Header from "../components/Header"; // ✅ import header

export default function Opening() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Imported Header */}
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-[90vh] flex flex-col justify-center items-center text-center px-6 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${myImage})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Hero Text */}
        <div className="relative z-10 text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
            Welcome to AI Tools Hub
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Your AI-powered toolkit to master interviews, plan studies, and test
            your knowledge with intelligent MCQ quizzes.
          </p>

          <button
            onClick={() => navigate("/home")}
            className="bg-white text-gray-900 px-8 py-3 rounded-full text-lg font-semibold hover:scale-105 transition transform shadow-lg"
          >
            Explore Now
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          {/* AI Mock Interview */}
          <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center text-center hover:scale-105 transition transform">
            <FaLaptopCode className="text-5xl text-blue-600 mb-6" />
            <h2 className="text-2xl font-bold mb-4">AI Mock Interview</h2>
            <p className="text-gray-600 mb-6">
              Practice real interview questions with AI feedback and improve your confidence.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Start Interview
            </button>
          </div>

          {/* AI Study Planner */}
          <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center text-center hover:scale-105 transition transform">
            <FaCalendarAlt className="text-5xl text-green-600 mb-6" />
            <h2 className="text-2xl font-bold mb-4">AI Study Planner</h2>
            <p className="text-gray-600 mb-6">
              Create a personalized study plan powered by AI with YouTube resources and calendar integration.
            </p>
            <button
              onClick={() => navigate("/study-planner")}
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
            >
              Create Plan
            </button>
          </div>

          {/* AI MCQ Quiz */}
          <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center text-center hover:scale-105 transition transform">
            <FaQuestionCircle className="text-5xl text-orange-500 mb-6" />
            <h2 className="text-2xl font-bold mb-4">AI MCQ Quiz</h2>
            <p className="text-gray-600 mb-6">
              Instantly generate quizzes on any topic and test your understanding with AI-curated questions.
            </p>
            <button
              onClick={() => navigate("/mcq-quiz")}
              className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition"
            >
              Take Quiz
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Start Learning Smarter with AI
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto">
          Practice, plan, and test your knowledge — all in one AI-driven hub.
        </p>
        <button
          onClick={() => navigate("/home")}
          className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:scale-105 transition transform shadow-lg"
        >
          Start Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-2">© 2025 AI Tools Hub. All rights reserved.</p>
          <p className="text-gray-400">
            Built with ❤️ using React, Tailwind CSS, and Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
}
