import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import Opening from "./pages/Opening";
import MCQQuiz from "./pages/MCQQuiz";
import StudyPlanner from "./pages/StudyPlanner";
function App() {
  return (
    <div className="w-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Opening />} />
          <Route path="/home" element={<Home />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/mcq-quiz" element={<MCQQuiz />} />
          <Route path="/study-planner" element={<StudyPlanner />} />
        </Routes>
      </Router>
    </div>
  );
}


export default App;
