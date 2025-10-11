"use client";
import React, { useState } from "react";

export default function WorkoutRoutineScheduler() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [routine, setRoutine] = useState([]);
  // --- MASTER EXERCISE POOL (> 50) ---
  const exercises = {
    underweight: [
      "💪 Push Ups – 15 reps",
      "🏋️ Dumbbell Curls – 12 reps",
      "🦵 Squats – 20 reps",
      "🏋️ Bench Press – 12 reps",
      "🏋️ Deadlifts – 10 reps",
      "🦵 Lunges – 15 each leg",
      "🏋️ Shoulder Press – 12 reps",
      "💪 Tricep Dips – 15 reps",
      "🦵 Leg Press – 12 reps",
      "🏋️ Lat Pulldown – 12 reps",
      "🏋️ Bicep Curls – 15 reps",
      "🏋️ Chest Fly – 12 reps",
      "🏋️ Cable Rows – 12 reps",
      "🏋️ Weighted Squats – 15 reps",
      "🏋️ Overhead Dumbbell Press – 12 reps",
      "🏋️ Bulgarian Split Squats – 12 reps",
      "🏋️ Barbell Rows – 12 reps",
      "🏋️ Incline Bench Press – 12 reps",
      "🏋️ Seated Military Press – 12 reps",
      "🦵 Calf Raises – 20 reps",
    ],
    normal: [
      "🏃 Jumping Jacks – 30 sec",
      "🔥 Burpees – 12 reps",
      "💪 Push Ups – 20 reps",
      "🦵 Squats – 20 reps",
      "⛰️ Mountain Climbers – 40 sec",
      "🧘 Plank – 1 min",
      "🏋️ Bench Press – 12 reps",
      "🏋️ Shoulder Press – 12 reps",
      "🦵 Lunges – 15 each leg",
      "🏋️ Deadlifts – 10 reps",
      "🏋️ Pull Ups – 10 reps",
      "🏋️ Bicep Curls – 12 reps",
      "🏋️ Tricep Dips – 12 reps",
      "🏋️ Lat Pulldown – 12 reps",
      "🏋️ Arnold Press – 12 reps",
      "🏋️ Chest Fly – 12 reps",
      "🏋️ Cable Rows – 12 reps",
      "🏋️ Kettlebell Swings – 15 reps",
      "🏋️ Push Press – 10 reps",
      "🧘 Side Plank – 30 sec each side",
    ],
    overweight: [
      "🚴 Cycling – 10 min",
      "🏃 Jogging – 5 min",
      "🔥 Jump Rope – 2 min",
      "🔥 Burpees – 10 reps",
      "⛰️ Mountain Climbers – 40 sec",
      "🧘 Plank – 45 sec",
      "🦵 Squats – 15 reps",
      "💪 Push Ups – 12 reps",
      "🚶 Brisk Walking – 10 min",
      "🏋️ Kettlebell Swings – 12 reps",
      "🦵 Step Ups – 12 reps each leg",
      "🦵 Glute Bridges – 15 reps",
      "🧘 Yoga Stretch – 5 min",
      "🏋️ Battle Ropes – 30 sec",
      "🚴 Stationary Bike – 8 min",
      "🏋️ Medicine Ball Slams – 12 reps",
      "🔥 Jumping Jacks – 30 sec",
      "🏋️ Farmer Walk – 1 min",
      "🏋️ Weighted Step Ups – 12 reps each leg",
      "🧘 Cat Cow Stretch – 1 min",
    ],
  };

  // Utility: pick random set
  const getRandomExercises = (list, count) => {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Main generator
  const generateRoutine = (e) => {
    e.preventDefault();

    let newRoutine = [];
    const h = parseInt(height);
    const w = parseInt(weight);

    // --- Logic based on BMI-ish conditions ---
    if (w < 60 && h > 165) {
      // tall & underweight
      newRoutine = getRandomExercises(exercises.underweight, 12);
    } else if (w >= 60 && w < 80 && h >= 160 && h <= 180) {
      // normal
      newRoutine = getRandomExercises(exercises.normal, 12);
    } else if (w >= 80 || h < 155) {
      // overweight or short with weight
      newRoutine = getRandomExercises(exercises.overweight, 12);
    } else {
      // fallback
      newRoutine = getRandomExercises(
        [...exercises.underweight, ...exercises.normal],
        12
      );
    }

    setRoutine(newRoutine);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white font-poppins p-6 mt-16">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-6 text-orange-500 tracking-wide">
          Workout Routine Scheduler
        </h1>

        {/* Form */}
        <form onSubmit={generateRoutine} className="space-y-5">
          <div className="text-left">
            <label className="block mb-2 font-medium">Weight (kg):</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="text-left">
            <label className="block mb-2 font-medium">Height (cm):</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 font-semibold text-lg hover:scale-105 transform transition duration-300"
          >
            Get My Workout Plan
          </button>
        </form>

        {/* Results */}
        {routine.length > 0 && (
          <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-inner text-left">
            <h2 className="text-xl font-bold text-orange-400 mb-4">
              Your Workout Routine:
            </h2>
            <ul className="space-y-3">
              {routine.map((exercise, i) => (
                <li
                  key={i}
                  className="p-3 bg-gray-900 rounded-lg hover:bg-gray-700 transition"
                >
                  {exercise}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
