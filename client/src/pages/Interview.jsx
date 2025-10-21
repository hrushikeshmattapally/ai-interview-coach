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
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], role, company, mode }),
      });
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
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, role, company, mode }),
      });

      const data = await res.json();

      if (data.type === "final") {
        // 🎯 End interview
        setInterviewEnded(true);
        setFinalSummary({
          score: data.score || 0,
          feedback: data.feedback || "",
        });
      } else {
        // 🧩 Show feedback and next question
        let aiReply = "";
        if (mode === "immediate" && data.feedback) {
          aiReply = `💬 Feedback: ${data.feedback}\n\n${data.question}`;
        } else {
          aiReply = data.question;
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: aiReply },
        ]);

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
    <div className="interview-container">
      {!interviewEnded ? (
        <div className="chat-box">
          <h2>🎯 AI Interview Coach</h2>
          <p>
            Role: {role || "N/A"} {company && `| Company: ${company}`}
          </p>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>

          {/* Chat Section */}
          <div className="messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${msg.role === "user" ? "user" : "assistant"}`}
              >
                {msg.content}
              </div>
            ))}
            {loading && <div className="thinking">🤔 AI is thinking...</div>}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your answer..."
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading}>
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      ) : (
        // ✅ Final Scorecard
        <div className="result-screen">
          <div className="result-box">
            <h1 className="text-3xl font-bold mb-3 text-white">
              🏁 Interview Completed
            </h1>
            <p className="text-xl text-gray-100 mb-4">
              Role: <strong>{role}</strong>
              {company && ` | Company: ${company}`}
            </p>

            <div className="score-display">
              <h2 className="text-5xl font-bold text-green-400 mb-2">
                {finalSummary?.score ?? score} / 10
              </h2>
              <p className="text-gray-200 text-lg">Final Score</p>
            </div>

            <div className="summary">
              <h3 className="text-xl font-semibold mb-2 text-yellow-300">
                Feedback Summary:
              </h3>
              <p className="text-gray-100 whitespace-pre-line">
                {finalSummary?.feedback || "No feedback available."}
              </p>
            </div>

            <div className="result-buttons">
              <button onClick={restartInterview} className="retry-btn">
                🔁 Restart Interview
              </button>
              <button onClick={() => navigate("/")} className="home-btn">
                🏠 Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .interview-container {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, #00b4d8, #007bff);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
          color: #fff;
        }
        .chat-box {
          width: 100%;
          max-width: 800px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          height: 90vh;
        }
        .progress-bar {
          height: 10px;
          background: rgba(255,255,255,0.2);
          border-radius: 5px;
          margin: 10px 0;
          overflow: hidden;
        }
        .progress {
          height: 100%;
          background: #00ffcc;
          transition: width 0.4s ease;
        }
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .message {
          padding: 10px 14px;
          border-radius: 14px;
          margin-bottom: 8px;
          max-width: 80%;
          word-break: break-word;
        }
        .assistant {
          background-color: #007bff;
          color: white;
          align-self: flex-start;
        }
        .user {
          background-color: white;
          color: #333;
          align-self: flex-end;
        }
        .input-area {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .input-area input {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          border: none;
          outline: none;
          color: #fff;
          background: rgba(255,255,255,0.2);
        }
        .input-area button {
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          background-color: #ffffff;
          color: #007bff;
          font-weight: bold;
          cursor: pointer;
        }
        .result-screen {
          text-align: center;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .result-box {
          background: rgba(0, 0, 0, 0.5);
          padding: 40px;
          border-radius: 20px;
          max-width: 700px;
          width: 100%;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .score-display {
          background: rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 20px;
          margin: 20px 0;
        }
        .retry-btn, .home-btn {
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: bold;
          border: none;
          cursor: pointer;
          transition: 0.3s;
        }
        .retry-btn {
          background: #4ade80;
          color: #064e3b;
        }
        .retry-btn:hover {
          background: #22c55e;
        }
        .home-btn {
          background: #93c5fd;
          color: #1e3a8a;
        }
        .home-btn:hover {
          background: #60a5fa;
        }
        .summary {
          text-align: left;
          background: rgba(255,255,255,0.1);
          padding: 15px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
