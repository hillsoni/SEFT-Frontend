import React, { useState, useEffect } from "react";
import { FaDumbbell, FaFire, FaHeartbeat, FaTrophy, FaChartLine, FaCalendarAlt, FaSave, FaRedo, FaCheckCircle } from "react-icons/fa";

export default function WorkoutRoutineScheduler() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("balanced");
  const [experienceLevel, setExperienceLevel] = useState("intermediate");
  const [routine, setRoutine] = useState([]);
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [workoutIntensity, setWorkoutIntensity] = useState("");
  const [savedRoutines, setSavedRoutines] = useState([]);
  const [routineName, setRoutineName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Master exercise pool organized by type and difficulty
  const exercises = {
    strength: {
      beginner: [
        "💪 Wall Push-Ups – 12 reps",
        "🦵 Chair Squats – 15 reps",
        "🏋️ Dumbbell Curls (light) – 10 reps",
        "🦵 Standing Calf Raises – 20 reps",
        "💪 Knee Push-Ups – 10 reps",
        "🦵 Lunges – 10 each leg",
      ],
      intermediate: [
        "💪 Push-Ups – 15 reps",
        "🏋️ Dumbbell Curls – 12 reps",
        "🦵 Squats – 20 reps",
        "🏋️ Bench Press – 12 reps",
        "🦵 Lunges – 15 each leg",
        "🏋️ Shoulder Press – 12 reps",
        "💪 Tricep Dips – 15 reps",
        "🦵 Leg Press – 12 reps",
      ],
      advanced: [
        "🏋️ Deadlifts – 10 reps",
        "🏋️ Barbell Rows – 12 reps",
        "🏋️ Weighted Squats – 15 reps",
        "🏋️ Incline Bench Press – 12 reps",
        "🏋️ Bulgarian Split Squats – 12 reps",
        "💪 Diamond Push-Ups – 15 reps",
        "🏋️ Overhead Press – 12 reps",
        "🏋️ Pull-Ups – 10 reps",
      ]
    },
    cardio: {
      beginner: [
        "🚶 Brisk Walking – 10 min",
        "🔥 Jumping Jacks – 30 sec",
        "🚴 Stationary Bike – 8 min",
        "🏃 Light Jogging – 5 min",
      ],
      intermediate: [
        "🏃 Jogging – 10 min",
        "🔥 Jump Rope – 2 min",
        "🚴 Cycling – 15 min",
        "🏃 Interval Sprints – 5 min",
        "⛰️ Mountain Climbers – 45 sec",
      ],
      advanced: [
        "🏃 Running – 20 min",
        "🔥 HIIT Circuit – 15 min",
        "🚴 High-Intensity Cycling – 20 min",
        "🔥 Burpees – 15 reps",
        "⛰️ Mountain Climbers – 60 sec",
      ]
    },
    flexibility: {
      all: [
        "🧘 Hamstring Stretch – 30 sec",
        "🧘 Quad Stretch – 30 sec each leg",
        "🧘 Shoulder Stretch – 30 sec",
        "🧘 Cat-Cow Stretch – 1 min",
        "🧘 Child's Pose – 1 min",
      ]
    },
    core: {
      beginner: [
        "🧘 Plank – 30 sec",
        "🦵 Crunches – 15 reps",
        "🦵 Leg Raises – 10 reps",
      ],
      intermediate: [
        "🧘 Plank – 1 min",
        "🦵 Bicycle Crunches – 20 reps",
        "🦵 Leg Raises – 15 reps",
        "🦵 Russian Twists – 20 reps",
      ],
      advanced: [
        "🧘 Plank – 2 min",
        "🦵 Dragon Flags – 8 reps",
        "🦵 Hanging Leg Raises – 12 reps",
        "🦵 Ab Wheel Rollouts – 15 reps",
      ]
    }
  };

  // Load user data on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.height) setHeight(user.height.toString());
    if (user.weight) setWeight(user.weight.toString());

    // Load saved routines
    const saved = JSON.parse(localStorage.getItem("savedRoutines") || "[]");
    setSavedRoutines(saved);
  }, []);

  // Calculate BMI when height/weight change
  useEffect(() => {
    if (height && weight) {
      const h = parseFloat(height) / 100; // convert cm to m
      const w = parseFloat(weight);
      const bmiValue = (w / (h * h)).toFixed(1);
      setBmi(bmiValue);

      // Determine BMI category
      if (bmiValue < 18.5) {
        setBmiCategory("Underweight");
      } else if (bmiValue < 25) {
        setBmiCategory("Normal");
      } else if (bmiValue < 30) {
        setBmiCategory("Overweight");
      } else {
        setBmiCategory("Obese");
      }
    }
  }, [height, weight]);

  const getRandomExercises = (list, count) => {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const generateRoutine = (e) => {
    e.preventDefault();

    const h = parseInt(height);
    const w = parseInt(weight);
    let newRoutine = [];
    let intensity = "";
    let estimatedCalories = 0;

    // Determine workout based on BMI, goal, and experience
    if (fitnessGoal === "weight_loss" || bmiCategory === "Overweight" || bmiCategory === "Obese") {
      // Focus on cardio and high reps
      newRoutine = [
        ...getRandomExercises(exercises.cardio[experienceLevel] || exercises.cardio.intermediate, 3),
        ...getRandomExercises(exercises.strength[experienceLevel] || exercises.strength.intermediate, 3),
        ...getRandomExercises(exercises.core[experienceLevel] || exercises.core.intermediate, 2),
        ...getRandomExercises(exercises.flexibility.all, 2),
      ];
      intensity = "High Intensity (Fat Burning)";
      estimatedCalories = 400;
    } else if (fitnessGoal === "muscle_gain" || bmiCategory === "Underweight") {
      // Focus on strength training
      newRoutine = [
        ...getRandomExercises(exercises.strength[experienceLevel] || exercises.strength.intermediate, 6),
        ...getRandomExercises(exercises.core[experienceLevel] || exercises.core.intermediate, 2),
        ...getRandomExercises(exercises.flexibility.all, 2),
      ];
      intensity = "Moderate Intensity (Muscle Building)";
      estimatedCalories = 300;
    } else {
      // Balanced routine
      newRoutine = [
        ...getRandomExercises(exercises.cardio[experienceLevel] || exercises.cardio.intermediate, 2),
        ...getRandomExercises(exercises.strength[experienceLevel] || exercises.strength.intermediate, 4),
        ...getRandomExercises(exercises.core[experienceLevel] || exercises.core.intermediate, 2),
        ...getRandomExercises(exercises.flexibility.all, 2),
      ];
      intensity = "Moderate Intensity (Balanced)";
      estimatedCalories = 350;
    }

    setRoutine(newRoutine);
    setWorkoutIntensity(intensity);
    setCaloriesBurned(estimatedCalories);

    // Log activity
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.username) {
      const activity = {
        type: "Workout Routine Generated",
        title: `${fitnessGoal.replace('_', ' ')} - ${experienceLevel}`,
        date: new Date().toISOString().split('T')[0],
        calories: estimatedCalories,
      };
      const existingActivity = JSON.parse(localStorage.getItem("userActivity") || "[]");
      existingActivity.unshift(activity);
      localStorage.setItem("userActivity", JSON.stringify(existingActivity.slice(0, 50)));
    }
  };

  const saveRoutine = () => {
    if (!routineName.trim()) {
      alert("Please enter a routine name");
      return;
    }

    const newSavedRoutine = {
      id: Date.now(),
      name: routineName,
      routine: routine,
      bmi: bmi,
      goal: fitnessGoal,
      level: experienceLevel,
      intensity: workoutIntensity,
      calories: caloriesBurned,
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedRoutines, newSavedRoutine];
    setSavedRoutines(updated);
    localStorage.setItem("savedRoutines", JSON.stringify(updated));
    
    setShowSaveModal(false);
    setRoutineName("");
    alert("Routine saved successfully!");
  };

  const loadRoutine = (savedRoutine) => {
    setRoutine(savedRoutine.routine);
    setWorkoutIntensity(savedRoutine.intensity);
    setCaloriesBurned(savedRoutine.calories);
    setFitnessGoal(savedRoutine.goal);
    setExperienceLevel(savedRoutine.level);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteRoutine = (id) => {
    const updated = savedRoutines.filter(r => r.id !== id);
    setSavedRoutines(updated);
    localStorage.setItem("savedRoutines", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white font-poppins pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Workout Routine Scheduler
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get a personalized workout plan based on your body metrics, fitness goals, and experience level
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700/50 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaChartLine className="text-orange-400" />
                Your Details
              </h2>

              <form onSubmit={generateRoutine} className="space-y-6">
                {/* Weight */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    className="w-full p-4 rounded-xl bg-gray-900/50 border-2 border-gray-700 focus:border-orange-500 outline-none transition-all"
                    placeholder="75"
                  />
                </div>

                {/* Height */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                    className="w-full p-4 rounded-xl bg-gray-900/50 border-2 border-gray-700 focus:border-orange-500 outline-none transition-all"
                    placeholder="175"
                  />
                </div>

                {/* Fitness Goal */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">
                    Fitness Goal
                  </label>
                  <select
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value)}
                    className="w-full p-4 rounded-xl bg-gray-900/50 border-2 border-gray-700 focus:border-orange-500 outline-none transition-all"
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="balanced">Balanced Fitness</option>
                    <option value="endurance">Build Endurance</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full p-4 rounded-xl bg-gray-900/50 border-2 border-gray-700 focus:border-orange-500 outline-none transition-all"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* BMI Display */}
                {bmi && (
                  <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-xl border border-blue-500/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Your BMI</span>
                      <span className="text-2xl font-bold text-blue-400">{bmi}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Category: <span className="font-semibold text-blue-300">{bmiCategory}</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FaDumbbell /> Generate Workout Plan
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            {routine.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                <StatCard
                  icon={<FaFire />}
                  label="Est. Calories"
                  value={`${caloriesBurned} kcal`}
                  color="from-orange-500 to-red-500"
                />
                <StatCard
                  icon={<FaHeartbeat />}
                  label="Intensity"
                  value={workoutIntensity.split('(')[0]}
                  color="from-pink-500 to-purple-500"
                />
                <StatCard
                  icon={<FaTrophy />}
                  label="Exercises"
                  value={routine.length}
                  color="from-yellow-500 to-orange-500"
                />
              </div>
            )}

            {/* Routine Results */}
            {routine.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700/50 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold flex items-center gap-2">
                    <FaCalendarAlt className="text-pink-400" />
                    Your Workout Routine
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSaveModal(true)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-xl transition-all flex items-center gap-2"
                    >
                      <FaSave /> Save
                    </button>
                    <button
                      onClick={generateRoutine}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all flex items-center gap-2"
                    >
                      <FaRedo /> Regenerate
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {routine.map((exercise, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-900/50 p-4 rounded-xl hover:bg-gray-800/50 transition-all border border-gray-700/30 hover:border-gray-600/50 flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-gray-900 group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                      <span className="text-lg flex-1">{exercise}</span>
                      <FaCheckCircle className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                  <p className="text-blue-300 text-sm">
                    💡 <strong>Tip:</strong> Rest 30-60 seconds between exercises. Stay hydrated and maintain proper form throughout your workout.
                  </p>
                </div>
              </div>
            )}

            {/* Saved Routines */}
            {savedRoutines.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FaSave className="text-green-400" />
                  Saved Routines ({savedRoutines.length})
                </h2>

                <div className="grid gap-4">
                  {savedRoutines.map((saved) => (
                    <div
                      key={saved.id}
                      className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-yellow-400">{saved.name}</h3>
                          <p className="text-sm text-gray-400">
                            {new Date(saved.createdAt).toLocaleDateString()} • {saved.routine.length} exercises
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => loadRoutine(saved)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm transition-all"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => deleteRoutine(saved.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-lg text-sm transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                          {saved.goal.replace('_', ' ')}
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                          {saved.level}
                        </span>
                        <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                          {saved.calories} kcal
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {routine.length === 0 && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-12 rounded-3xl shadow-2xl border border-gray-700/50 text-center">
                <FaDumbbell className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-gray-400">
                  No Routine Generated Yet
                </h3>
                <p className="text-gray-500">
                  Fill in your details and click "Generate Workout Plan" to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full animate-fade-in">
            <h3 className="text-2xl font-bold mb-4">Save Routine</h3>
            <input
              type="text"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              placeholder="Enter routine name..."
              className="w-full p-4 rounded-xl bg-gray-900/50 border-2 border-gray-700 focus:border-green-500 outline-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={saveRoutine}
                className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-semibold transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  return (
    <div className={`bg-gradient-to-r ${color} p-6 rounded-2xl shadow-xl flex items-center gap-4 hover:scale-105 transition-transform`}>
      <div className="text-4xl">{icon}</div>
      <div>
        <div className="text-sm opacity-90">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}