// src/pages/DietResultPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCoffee, FaUtensils, FaAppleAlt, FaMoon, FaRobot, FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function DietResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state;

  const [activityLogs, setActivityLogs] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  if (!initialData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-6">
        <h1 className="text-3xl font-bold mb-4">No Data Found ❌</h1>
        <button
          onClick={() => navigate("/diet")}
          className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
        >
          Go Back to Form
        </button>
      </div>
    );
  }

  const [data] = useState(initialData);

  // --- Diet Plan Generator ---
  function generateDietPlan(info) {
    const { goal, diet_type, age, health_conditions = [], veg_type, cuisine, taste, mood_food } = info;
    const hasDiabetes = health_conditions.includes("Diabetes");

    const moodFoodMap = {
      calming: ["Chamomile tea", "Dark chocolate", "Almonds"],
      energizing: ["Bananas", "Oats", "Peanut butter"],
      digestive: ["Ginger tea", "Yogurt", "Fruits"],
      immunity: ["Citrus fruits", "Nuts", "Green veggies"],
    };
    const moodOptions = moodFoodMap[mood_food] || [];

    const mealOptions = {
      vegetarian: {
        breakfast: ["Oats + Milk + Fruits", "Protein smoothie + Nuts", "Whole grain toast + Avocado"],
        lunch: ["Rice + Dal + Veg curry", "Quinoa + Paneer curry + Salad", "Multigrain roti + Veg + Dal"],
        snack: ["Fruit bowl + Nuts", "Sprouts salad", "Greek yogurt + Honey"],
        dinner: ["Light khichdi + Veggies + Paneer", "Grilled paneer + Steamed veggies", "Veg soup + Multigrain roti"],
      },
      nonVegetarian: {
        breakfast: ["Egg omelette + Toast", "Scrambled eggs + Whole wheat bread", "Greek yogurt + Fruits"],
        lunch: ["Grilled chicken + Brown rice + Salad", "Fish curry + Veggies + Rice", "Chicken breast + Sweet potato + Veg"],
        snack: ["Boiled eggs + Apple", "Protein shake + Banana", "Nuts + Yogurt"],
        dinner: ["Grilled fish + Veggies", "Chicken curry + Brown rice", "Light soup + Grilled chicken"],
      },
    };

    function pickRandom(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    const selectedMeals = diet_type === "vegetarian" ? mealOptions.vegetarian : mealOptions.nonVegetarian;
    const diabetesSuffix = hasDiabetes ? " | Low sugar options" : "";

    const meals = [
      { meal: "Breakfast", icon: <FaCoffee className="inline mr-2 text-yellow-400" />, items: pickRandom(selectedMeals.breakfast) },
      { meal: "Lunch", icon: <FaUtensils className="inline mr-2 text-green-400" />, items: pickRandom(selectedMeals.lunch) },
      { meal: "Snack", icon: <FaAppleAlt className="inline mr-2 text-orange-400" />, items: pickRandom(selectedMeals.snack) },
      { meal: "Dinner", icon: <FaMoon className="inline mr-2 text-purple-400" />, items: pickRandom(selectedMeals.dinner) },
    ];

    return meals.map((m) => ({
      ...m,
      items: `${m.items}${moodOptions.length ? ` | Mood: ${pickRandom(moodOptions)}` : ""}${
        taste ? ` | Taste: ${taste}` : ""
      }${cuisine ? ` | Cuisine: ${cuisine}` : ""}${veg_type ? ` | Veg Type: ${veg_type}` : ""}${diabetesSuffix}`,
    }));
  }

  const [dietPlan, setDietPlan] = useState(generateDietPlan(data));

  const handleGenerateAgain = () => {
    setDietPlan(generateDietPlan(data));
    setActivityLogs((prev) => [...prev, "Clicked Generate Again"]);
  };

  useEffect(() => {
    setActivityLogs((prev) => [...prev, "Viewed Summary and Meal Plan"]);
  }, []);

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto text-white relative mt-8">
      <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
        Your Personalized Diet Plan 🍴
      </h1>

      {/* --- Summary Card --- */}
      <div className="bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-700">
        <h2 className="text-2xl font-semibold mb-6 text-pink-400">📋 Summary</h2>
        <ul className="text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
          <li>👤 Age: {data.age}</li>
          <li>⚧ Gender: {data.gender}</li>
          <li>⚖️ Weight: {data.weight} kg</li>
          <li>📏 Height: {data.height} cm</li>
          <li>🏃 Activity: {data.activity_level}</li>
          <li>🎯 Goal: {data.goal.replace("_", " ")}</li>
          <li>🥗 Diet Type: {data.diet_type}</li>
          {data.veg_type && <li>🌱 Veg Type: {data.veg_type}</li>}
          {data.cuisine && <li>🍛 Cuisine: {data.cuisine}</li>}
          {data.taste && <li>😋 Taste: {data.taste}</li>}
          {data.mood_food && <li>🧘 Mood-Food: {data.mood_food}</li>}
          <li>⏳ Duration: {data.duration.replace("_", " ")}</li>
          <li className="sm:col-span-2">
            ❤️ Health Conditions: {data.health_conditions.length > 0 ? data.health_conditions.join(", ") : "None"}
          </li>
        </ul>
      </div>

      {/* --- Meal Plan --- */}
      <div className="mt-12 bg-gray-800 p-8 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 text-orange-400">🥗 Recommended Meal Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dietPlan.map((meal, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 rounded-3xl border-l-8 shadow-2xl hover:scale-105 transition-transform ${
                meal.meal === "Breakfast"
                  ? "border-yellow-400"
                  : meal.meal === "Lunch"
                  ? "border-green-400"
                  : meal.meal === "Snack"
                  ? "border-orange-400"
                  : "border-purple-400"
              }`}
            >
              <h3 className="text-lg font-bold mb-2">{meal.icon} {meal.meal}</h3>
              <p className="text-gray-300 mt-2">{meal.items}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Generate Again Button --- */}
      <div className="text-center mt-12">
        <button
          onClick={handleGenerateAgain}
          className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 px-10 py-3 rounded-2xl font-semibold hover:scale-105 transition-transform shadow-lg"
        >
          🔄 Generate Again
        </button>
      </div>

      {/* --- Chatbot --- */}
      <div className="fixed bottom-6 right-6 w-80 z-50">
        <div className={`bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-xl flex flex-col h-16 transition-all ${chatOpen ? "h-96" : "h-16"}`}>
          {/* Header */}
          <div className="flex justify-between items-center p-3 cursor-pointer" onClick={() => setChatOpen(!chatOpen)}>
            <div className="flex items-center text-white font-semibold">
              <FaRobot className="mr-2 text-pink-500" /> HealthBot
            </div>
            {chatOpen ? <FaChevronDown className="text-white" /> : <FaChevronUp className="text-white" />}
          </div>

          {/* Chat Messages */}
          {chatOpen && (
            <div className="flex-1 overflow-y-auto px-3 space-y-2">
              {activityLogs.map((log, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-pink-500/20 text-white self-start">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
