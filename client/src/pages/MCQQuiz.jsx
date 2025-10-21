import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header"; // ✅ imported Header

export default function MCQQuiz() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [time, setTime] = useState(0);

  // ⏱️ Timer
  useEffect(() => {
    if (!finished && questions.length > 0) {
      const timer = setInterval(() => setTime((t) => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [finished, questions]);

  // 🎯 Generate Questions
  const handleGenerate = async () => {
    if (!topic.trim()) return alert("Please enter a topic!");
    setLoading(true);
    setQuestions([]);
    setCurrent(0);
    setScore(0);
    setFinished(false);
    setFeedback("");
    setTime(0);

    try {
      const res = await axios.post("https://ai-tools-hub-wj6j.onrender.com/api/generate-mcq", {
        topic,
        count,
      });
      setQuestions(res.data.mcqs);
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Failed to generate questions. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Answer Selection
  const handleAnswer = (opt) => {
    if (selected) return; // prevent multiple clicks
    setSelected(opt);

    const correctAnswer = questions[current].answer.trim().toLowerCase();
    const chosen = opt.trim().toLowerCase();
    const isCorrect = chosen === correctAnswer;

    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Wrong! Correct answer: ${questions[current].answer}`);
    }

    setTimeout(() => {
      setFeedback("");
      setSelected("");
      if (current + 1 < questions.length) {
        setCurrent((c) => c + 1);
      } else {
        setFinished(true);
      }
    }, 2000);
  };

  // 🌀 Loading state
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-xl text-gray-700">
        <Header /> {/* ✅ Keep Header visible even during loading */}
        Generating MCQs...
      </div>
    );
  }

  // 🏁 Final Scorecard
  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 text-white p-6">
        <Header /> {/* ✅ Header added */}
        <h1 className="text-4xl font-bold mb-6">🎉 Quiz Completed!</h1>
        <p className="text-xl mb-3">
          <strong>Score:</strong> {score} / {questions.length}
        </p>
        <p className="text-lg mb-6">
          <strong>Time Taken:</strong> {Math.floor(time / 60)}m {time % 60}s
        </p>
        <button
          onClick={handleGenerate}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // 🧩 Topic Input Screen
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 flex flex-col items-center justify-center text-white p-6">
        <Header /> {/* ✅ Header added here too */}
        <h1 className="text-4xl font-extrabold mb-6 drop-shadow-md">
          🧠 AI MCQ Quiz Generator
        </h1>

        <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <input
            type="text"
            placeholder="Enter topic (e.g. Computer Science)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-lg border-none outline-none text-gray-900 bg-white focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="No. of Questions"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full mb-6 px-4 py-3 rounded-lg border-none outline-none text-gray-900 bg-white focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Generate MCQs
          </button>
        </div>
      </div>
    );
  }

  // 🧠 Quiz Question Screen
  const q = questions[current];
  const normalizedAnswer = q.answer?.trim().toLowerCase();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-500 text-white p-6">
      <Header /> {/* ✅ Header visible during quiz */}
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-lg w-full max-w-2xl text-center mt-16">
        <h2 className="text-2xl font-bold mb-4">
          Question {current + 1} of {questions.length}
        </h2>
        <p className="text-lg mb-6">{q.question}</p>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            const isSelected = selected === opt;
            const isCorrect = opt.trim().toLowerCase() === normalizedAnswer;
            const showGreen =
              selected && (isCorrect || (isSelected && isCorrect));
            const showRed = selected && isSelected && !isCorrect;

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                disabled={!!selected}
                className={`block w-full text-left px-4 py-3 rounded-lg border transition
                ${
                  showGreen
                    ? "bg-green-500 text-white border-green-400"
                    : showRed
                    ? "bg-red-500 text-white border-red-400"
                    : "bg-white text-gray-900 hover:bg-blue-100"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {feedback && (
          <p className="mt-4 text-lg font-semibold">{feedback}</p>
        )}

        <p className="mt-6 text-sm text-gray-200">
          ⏱️ Time: {Math.floor(time / 60)}m {time % 60}s | ✅ Score: {score}
        </p>
      </div>
    </div>
  );
}
