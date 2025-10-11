import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import WorkoutRoutineScheduler from "./pages/Workout";
import Routine from "./pages/Routine";
import { DietPlanPage } from "./pages/Diet";
import DietResultPage from "./pages/DietResultPage";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Yoga from "./components/Yoga";
import Meditation from "./components/Meditation";
import ChallengesPage from "./components/Challenges";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./components/Chatbot"; // <-- Import chatbot

// --- Private Route Wrapper ---
function PrivateRoute({ element }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? element : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="bg-black text-white min-h-screen font-poppins relative">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} />}
        />
        <Route
          path="/workout"
          element={<PrivateRoute element={<WorkoutRoutineScheduler />} />}
        />
        <Route
          path="/workout/yoga"
          element={<PrivateRoute element={<Yoga />} />}
        />
        <Route
          path="/workout/meditation"
          element={<PrivateRoute element={<Meditation />} />}
        />
        <Route
          path="/workout/challenges"
          element={<PrivateRoute element={<ChallengesPage />} />}
        />
        <Route
          path="/routine"
          element={<PrivateRoute element={<Routine />} />}
        />
        <Route
          path="/diet"
          element={<PrivateRoute element={<DietPlanPage />} />}
        />
        <Route
          path="/diet-result"
          element={<PrivateRoute element={<DietResultPage />} />}
        />
      </Routes>
      <Footer />
      <Chatbot /> {/* <-- Add chatbot here so it's on all pages */}
    </div>
  );
}
