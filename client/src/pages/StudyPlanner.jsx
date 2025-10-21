import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header"; // ✅ Added Header import

export default function StudyPlanner() {
  const [skill, setSkill] = useState("");
  const [hours, setHours] = useState("");
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Generate Study Plan
  const handleGenerate = async () => {
    if (!skill || !hours) return alert("Please enter both fields!");
    setLoading(true);
    setPlan([]);

    try {
      const res = await axios.post("https://ai-tools-hub-wj6j.onrender.com/api/study-plan", {
        skill,
        hoursPerDay: hours,
      });

      setPlan(res.data.studyPlan || []);
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Failed to generate study plan. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // 🗓️ Add to Calendar
  const addToCalendar = (item) => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `Study: ${item.topic}`
    )}&details=${encodeURIComponent(
      `Learn ${item.topic} (${item.duration}). YouTube: ${
        item.youtube
      }, Website: ${item.website}`
    )}&dates=${startDate
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]}Z/${endDate
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]}Z`;

    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex flex-col items-center py-12 px-4">
      {/* ✅ Global Header (top navigation) */}
      <Header />

      {/* 🧭 Page Header */}
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-6 tracking-tight mt-10">
        AI Study Planner
      </h1>
      <p className="text-gray-600 mb-10 text-center max-w-xl">
        Generate a detailed learning plan for any skill with daily goals, YouTube
        tutorials, and website links — and easily add study sessions to your
        Google Calendar.
      </p>

      {/* 🧩 Input Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <input
          type="text"
          placeholder="Skill (e.g., Python)"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 w-64 focus:ring-2 focus:ring-indigo-400 outline-none"
        />
        <input
          type="number"
          placeholder="Hours per day"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 w-48 focus:ring-2 focus:ring-indigo-400 outline-none"
        />
        <button
          onClick={handleGenerate}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          {loading ? "Generating..." : "Generate Study Plan"}
        </button>
      </div>

      {/* 📊 Study Plan Table */}
      {plan.length > 0 && (
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 overflow-x-auto transition-all duration-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-100 text-indigo-800">
                <th className="p-3 border">Day</th>
                <th className="p-3 border">Topic</th>
                <th className="p-3 border">Duration</th>
                <th className="p-3 border">YouTube</th>
                <th className="p-3 border">Website</th>
                <th className="p-3 border">Calendar</th>
              </tr>
            </thead>
            <tbody>
              {plan.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-indigo-50 text-gray-700 transition"
                >
                  <td className="p-3 border font-medium">{item.day}</td>
                  <td className="p-3 border">{item.topic}</td>
                  <td className="p-3 border">{item.duration}</td>
                  <td className="p-3 border text-blue-600 underline">
                    <a
                      href={
                        item.youtube?.startsWith("http")
                          ? item.youtube
                          : `https://www.youtube.com/results?search_query=${encodeURIComponent(
                              item.youtube || ""
                            )}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Watch
                    </a>
                  </td>
                  <td className="p-3 border text-blue-600 underline">
                    <a
                      href={
                        item.website?.startsWith("http")
                          ? item.website
                          : `https://www.google.com/search?q=${encodeURIComponent(
                              item.website || ""
                            )}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit
                    </a>
                  </td>
                  <td className="p-3 border text-indigo-600 font-medium">
                    <button
                      onClick={() => addToCalendar(item)}
                      className="px-3 py-1 border border-indigo-500 rounded-lg hover:bg-indigo-100"
                    >
                      ➕ Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📎 Empty State */}
      {!loading && plan.length === 0 && (
        <p className="text-gray-500 mt-6">
          Enter a skill and hours per day to generate your personalized study plan.
        </p>
      )}
    </div>
  );
}
