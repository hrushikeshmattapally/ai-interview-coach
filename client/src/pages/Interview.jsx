import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Interview() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { role, company, mode } = state || {};

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [finalSummary, setFinalSummary] = useState(null);
  const chatEndRef = useRef(null);

  // Auto scroll chat down
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start interview on mount
  useEffect(() => {
    startInterview();
  }, []); // eslint-disable-line

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://ai-tools-hub-wj6j.onrender.com/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [], role, company, mode }),
        }
      );
      const data = await res.json();
      if (data.question) {
        setMessages([{ role: "assistant", content: data.question }]);
        setProgress(data.progress || 0);
      } else {
        setMessages([{ role: "assistant", content: "⚠️ Unable to start interview." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages([{ role: "assistant", content: "❌ Server error." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!userInput.trim() || loading) return;
    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://ai-tools-hub-wj6j.onrender.com/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages, role, company, mode }),
        }
      );

      const data = await res.json();

      if (data.type === "final") {
        setInterviewEnded(true);
        setFinalSummary({
          score: data.score || 0,
          feedback: data.feedback || "",
        });
      } else {
        let aiReply = "";
        if (data.type === "feedback") {
          aiReply = `💬 **Feedback:** ${data.feedback || "No feedback"}\n\n📘 **Next Question:** ${data.question}`;
        } else if (data.question) {
          aiReply = data.question;
        } else {
          aiReply = "🤖 Unexpected response from AI.";
        }

        setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
        if (typeof data.progress === "number") setProgress(data.progress);
        if (typeof data.score === "number") setScore(data.score);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const restartInterview = () => {
    setMessages([]);
    setScore(0);
    setProgress(0);
    setInterviewEnded(false);
    setFinalSummary(null);
    startInterview();
  };

  return (
    <div className="interview-container p-2 sm:p-4 md:p-6">
      {!interviewEnded ? (
        <div className="chat-box w-full max-w-3xl mx-auto flex flex-col bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 h-[90vh]">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center sm:text-left">🎯 AI Interview Coach</h2>
          <p className="text-sm sm:text-base mb-2">
            Role: {role || "N/A"} {company && `| Company: ${company}`}
          </p>

          {/* Progress Bar */}
          <div className="progress-bar h-2 bg-white/20 rounded-full mb-2">
            <div className="progress h-2 bg-green-400 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>

          {/* Messages */}
          <div className="messages flex-1 overflow-y-auto mb-2 p-2 bg-white/10 rounded-md">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message p-2 my-1 rounded-md max-w-[80%] break-words ${
                  msg.role === "user" ? "bg-white text-gray-900 self-end" : "bg-blue-600 text-white self-start"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && <div className="thinking text-gray-200">🤔 AI is thinking...</div>}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input */}
          <div className="input-area flex gap-2 sm:gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your answer..."
              disabled={loading}
              className="flex-1 p-2 sm:p-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100 transition"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      ) : (
        <div className="result-screen flex flex-col items-center justify-center p-4 min-h-screen">
          <div className="result-box bg-black/50 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-xl text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">🏁 Interview Completed</h1>
            <p className="text-gray-200 mb-4 text-sm sm:text-base">
              Role: <strong>{role}</strong> {company && `| Company: ${company}`}
            </p>

            <div className="score-display bg-white/10 rounded-lg p-4 mb-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-green-400">{finalSummary?.score ?? score} / 10</h2>
              <p className="text-gray-200 text-sm sm:text-base">Final Score</p>
            </div>

            <div className="summary text-left bg-white/10 p-3 rounded-md mb-4">
              <h3 className="text-yellow-300 font-semibold text-base sm:text-lg">Feedback Summary:</h3>
              <p className="text-gray-100 text-sm sm:text-base whitespace-pre-line">{finalSummary?.feedback || "No feedback available."}</p>
            </div>

            <div className="result-buttons flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={restartInterview}
                className="retry-btn bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 rounded-md font-semibold"
              >
                🔁 Restart Interview
              </button>
              <button
                onClick={() => navigate("/")}
                className="home-btn bg-blue-400 hover:bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-md font-semibold"
              >
                🏠 Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .progress-bar { overflow:hidden; }
        .progress { transition: width 0.4s ease; }
      `}</style>
    </div>
  );
}
