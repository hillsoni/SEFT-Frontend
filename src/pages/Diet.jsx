// pages/Diet.js
import React, { useState, useRef } from "react";
import { dietAPI } from "../api";
import Swal from "sweetalert2";
import { FaCoffee, FaUtensils, FaAppleAlt, FaMoon } from "react-icons/fa";

export function DietPlanPage() {
  const [loading, setLoading] = useState(false);
  const [dietResult, setDietResult] = useState(null);
  const resultsRef = useRef(null);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    activity_level: "",
    goal: "",
    diet_type: "",
    veg_type: "",
    cuisine: "",
    taste: "",
    mood_food: "",
    duration: "",
    health_conditions: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => {
        const updated = checked
          ? [...prev.health_conditions, value]
          : prev.health_conditions.filter((c) => c !== value);
        return { ...prev, health_conditions: updated };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert form data to match backend API format
      const apiData = {
        age: parseInt(formData.age),
        gender: formData.gender,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        activity_level: formData.activity_level,
        goal: formData.goal,
        diet_type: formData.diet_type,
        duration: formData.duration || "1_month",
        ...(formData.veg_type && { veg_type: formData.veg_type }),
        ...(formData.cuisine && { cuisine: formData.cuisine }),
        ...(formData.taste && { taste: formData.taste }),
        ...(formData.mood_food && { mood_food: formData.mood_food }),
        ...(formData.health_conditions.length > 0 && {
          health_conditions: formData.health_conditions,
        }),
      };

      const response = await dietAPI.generate(apiData);
      const dietPlan = response.data.diet_plan;

      // Set results on the same page
      setDietResult({
        formData: formData,
        dietPlan: dietPlan.plan,
      });

      // Scroll to results after a short delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (error) {
      console.error("Diet plan generation error:", error);
      Swal.fire({
        icon: "error",
        title: "Generation Failed",
        text:
          error.response?.data?.error ||
          error.message ||
          "Failed to generate diet plan. Please try again.",
        confirmButtonText: "OK",
        background: "#1f2937",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDietResult(null);
    setFormData({
      age: "",
      gender: "",
      weight: "",
      height: "",
      activity_level: "",
      goal: "",
      diet_type: "",
      veg_type: "",
      cuisine: "",
      taste: "",
      mood_food: "",
      duration: "",
      health_conditions: [],
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper function to parse AI response and extract meals
  const parseDietPlan = (aiResponse, formData) => {
    // Try to extract structured meal information from AI response
    // If the response is structured JSON or text, parse it
    // Otherwise, create a default structure
    
    const meals = [];
    const mealTypes = ["Breakfast", "Lunch", "Snack", "Dinner"];
    const mealIcons = [
      <FaCoffee className="inline mr-2 text-yellow-400" />,
      <FaUtensils className="inline mr-2 text-green-400" />,
      <FaAppleAlt className="inline mr-2 text-orange-400" />,
      <FaMoon className="inline mr-2 text-purple-400" />,
    ];

    // If the response is a string, try to extract meal information
    if (typeof aiResponse === "string") {
      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(aiResponse);
        if (parsed.meals || parsed.meal_plan) {
          const mealData = parsed.meals || parsed.meal_plan;
          mealTypes.forEach((mealType, index) => {
            const mealInfo = mealData[mealType.toLowerCase()] || mealData[index] || {};
            meals.push({
              meal: mealType,
              icon: mealIcons[index],
              items: typeof mealInfo === "string" 
                ? mealInfo 
                : mealInfo.items || mealInfo.description || mealInfo.food || "See full plan below",
              calories: mealInfo.calories,
              nutrition: mealInfo.nutrition,
            });
          });
        }
      } catch (e) {
        // Not JSON, try to extract from text
        const lines = aiResponse.split("\n");
        let currentMeal = null;
        
        lines.forEach((line) => {
          const lowerLine = line.toLowerCase();
          mealTypes.forEach((mealType, index) => {
            if (lowerLine.includes(mealType.toLowerCase())) {
              currentMeal = {
                meal: mealType,
                icon: mealIcons[index],
                items: line.replace(new RegExp(mealType, "gi"), "").trim() || "See full plan below",
              };
            }
          });
          if (currentMeal && !meals.find((m) => m.meal === currentMeal.meal)) {
            meals.push(currentMeal);
          }
        });
      }
    }

    // If we couldn't parse meals, create default structure with full AI response
    if (meals.length === 0) {
      mealTypes.forEach((mealType, index) => {
        meals.push({
          meal: mealType,
          icon: mealIcons[index],
          items: typeof aiResponse === "string" ? aiResponse : "See full plan below",
        });
      });
    }

    return meals;
  };

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto mt-8">
      <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
        Build Your Personalized Diet Plan 🥗
      </h1>

      {/* Form Section */}
      <div className={dietResult ? "mb-12" : ""}>
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-gray-900 p-10 rounded-2xl shadow-xl"
        >
        {/* Age */}
        <div>
          <label className="block text-gray-300 mb-2">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-300 mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-gray-300 mb-2">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        {/* Height */}
        <div>
          <label className="block text-gray-300 mb-2">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-gray-300 mb-2">Activity Level</label>
          <select
            name="activity_level"
            value={formData.activity_level}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select Activity Level</option>
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="light">Lightly active (1-3 days/week)</option>
            <option value="moderate">Moderately active (3-5 days/week)</option>
            <option value="active">Active (6-7 days/week)</option>
            <option value="very_active">Very Active (intense exercise)</option>
          </select>
        </div>

        {/* Goal */}
        <div>
          <label className="block text-gray-300 mb-2">Goal</label>
          <select
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-pink-500"
            required
          >
            <option value="">Select Goal</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="weight_gain">Weight Gain</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* Diet Type */}
        <div>
          <label className="block text-gray-300 mb-2">Preferred Diet Type</label>
          <select
            name="diet_type"
            value={formData.diet_type}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select Diet Type</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non_vegetarian">Non-Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="keto">Keto</option>
            <option value="balanced">Balanced</option>
          </select>
        </div>

        {/* Vegetarian Type */}
        {formData.diet_type === "vegetarian" && (
          <div>
            <label className="block text-gray-300 mb-2">Vegetarian Type</label>
            <select
              name="veg_type"
              value={formData.veg_type}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select Veg Type</option>
              <option value="lacto_vegetarian">Lacto Vegetarian</option>
              <option value="ovo_vegetarian">Ovo Vegetarian</option>
              <option value="lacto_ovo_vegetarian">Lacto-Ovo Vegetarian</option>
            </select>
          </div>
        )}

        {/* Cuisine */}
        <div>
          <label className="block text-gray-300 mb-2">Preferred Cuisine</label>
          <select
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Cuisine</option>
            <option value="gujarati">Gujarati</option>
            <option value="marathi">Maharashtrian</option>
            <option value="south_indian">South Indian</option>
            <option value="north_indian">North Indian</option>
            <option value="continental">Continental</option>
          </select>
        </div>

        {/* Taste */}
        <div>
          <label className="block text-gray-300 mb-2">Taste Preference</label>
          <select
            name="taste"
            value={formData.taste}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select Taste Preference</option>
            <option value="sweet">Sweet</option>
            <option value="spicy">Spicy</option>
            <option value="salty">Salty</option>
            <option value="sour">Sour</option>
            <option value="bitter">Bitter</option>
            <option value="balanced">Balanced</option>
          </select>
        </div>

        {/* Mood-Based Food */}
        <div>
          <label className="block text-gray-300 mb-2">Mood-Based Food Preference</label>
          <select
            name="mood_food"
            value={formData.mood_food}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Mood Food Type</option>
            <option value="calming">Foods to keep calm & reduce anger</option>
            <option value="energizing">Foods to boost energy & focus</option>
            <option value="digestive">Foods for better digestion</option>
            <option value="immunity">Foods for immunity & overall wellness</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-gray-300 mb-2">Plan Duration</label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-pink-500"
            required
          >
            <option value="">Select Duration</option>
            <option value="1_week">1 Week</option>
            <option value="1_month">1 Month</option>
            <option value="3_months">3 Months</option>
            <option value="6_months">6 Months</option>
          </select>
        </div>

        {/* Health Conditions */}
        <div>
          <label className="block text-gray-300 mb-3">Health Conditions</label>
          <div className="grid grid-cols-2 gap-3 text-gray-300">
            {["Diabetes", "High BP", "Thyroid", "Cholesterol", "PCOS", "None"].map((cond) => (
              <label key={cond} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={cond}
                  checked={formData.health_conditions.includes(cond)}
                  onChange={handleChange}
                  className="accent-pink-500"
                />
                {cond}
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Plan...</span>
            </div>
          ) : (
            "Generate Diet Plan 🚀"
          )}
        </button>
      </form>
      </div>

      {/* Results Section */}
      {dietResult && (
        <div ref={resultsRef} className="mt-12 space-y-8">
          <h2 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Your Personalized Diet Plan 🍴
          </h2>

          {/* Summary Card */}
          <div className="bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-700">
            <h3 className="text-2xl font-semibold mb-6 text-pink-400">📋 Summary</h3>
            <ul className="text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
              <li>👤 Age: {dietResult.formData.age}</li>
              <li>⚧ Gender: {dietResult.formData.gender}</li>
              <li>⚖️ Weight: {dietResult.formData.weight} kg</li>
              <li>📏 Height: {dietResult.formData.height} cm</li>
              <li>🏃 Activity: {dietResult.formData.activity_level}</li>
              <li>🎯 Goal: {dietResult.formData.goal.replace("_", " ")}</li>
              <li>🥗 Diet Type: {dietResult.formData.diet_type}</li>
              {dietResult.formData.veg_type && <li>🌱 Veg Type: {dietResult.formData.veg_type}</li>}
              {dietResult.formData.cuisine && <li>🍛 Cuisine: {dietResult.formData.cuisine}</li>}
              {dietResult.formData.taste && <li>😋 Taste: {dietResult.formData.taste}</li>}
              {dietResult.formData.mood_food && <li>🧘 Mood-Food: {dietResult.formData.mood_food}</li>}
              <li>⏳ Duration: {dietResult.formData.duration.replace("_", " ")}</li>
              <li className="sm:col-span-2">
                ❤️ Health Conditions: {dietResult.formData.health_conditions.length > 0 ? dietResult.formData.health_conditions.join(", ") : "None"}
              </li>
            </ul>
          </div>

          {/* Meal Plan */}
          <div className="bg-gray-800 p-8 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-semibold mb-6 text-orange-400">🥗 Recommended Meal Plan</h3>
            
            {/* If dietPlan.meal_plan exists (structured from backend) */}
            {dietResult.dietPlan?.meal_plan ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {parseDietPlan(dietResult.dietPlan.meal_plan, dietResult.formData).map((meal, index) => (
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
                    <h4 className="text-lg font-bold mb-2">
                      {meal.icon} {meal.meal}
                    </h4>
                    <p className="text-gray-300 mt-2">{meal.items}</p>
                    {meal.calories && (
                      <p className="text-sm text-gray-400 mt-2">Calories: {meal.calories}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // If it's a text response from AI, show it in a readable format
              <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 rounded-3xl border border-gray-700">
                <div className="text-gray-300 whitespace-pre-wrap">
                  {typeof dietResult.dietPlan === "string" 
                    ? dietResult.dietPlan 
                    : dietResult.dietPlan?.meal_plan || JSON.stringify(dietResult.dietPlan, null, 2)}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-gray-600 to-gray-700 px-10 py-3 rounded-2xl font-semibold hover:scale-105 transition-transform shadow-lg text-white"
            >
              🔄 Generate New Plan
            </button>
            <button
              onClick={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const apiData = {
                    age: parseInt(dietResult.formData.age),
                    gender: dietResult.formData.gender,
                    weight: parseFloat(dietResult.formData.weight),
                    height: parseFloat(dietResult.formData.height),
                    activity_level: dietResult.formData.activity_level,
                    goal: dietResult.formData.goal,
                    diet_type: dietResult.formData.diet_type,
                    duration: dietResult.formData.duration || "1_month",
                    ...(dietResult.formData.veg_type && { veg_type: dietResult.formData.veg_type }),
                    ...(dietResult.formData.cuisine && { cuisine: dietResult.formData.cuisine }),
                    ...(dietResult.formData.taste && { taste: dietResult.formData.taste }),
                    ...(dietResult.formData.mood_food && { mood_food: dietResult.formData.mood_food }),
                    ...(dietResult.formData.health_conditions.length > 0 && {
                      health_conditions: dietResult.formData.health_conditions,
                    }),
                  };

                  const response = await dietAPI.generate(apiData);
                  const dietPlan = response.data.diet_plan;

                  setDietResult({
                    formData: dietResult.formData,
                    dietPlan: dietPlan.plan,
                  });

                  setTimeout(() => {
                    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 100);
                } catch (error) {
                  console.error("Diet plan generation error:", error);
                  Swal.fire({
                    icon: "error",
                    title: "Generation Failed",
                    text:
                      error.response?.data?.error ||
                      error.message ||
                      "Failed to generate diet plan. Please try again.",
                    confirmButtonText: "OK",
                    background: "#1f2937",
                    color: "#fff",
                  });
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 px-10 py-3 rounded-2xl font-semibold hover:scale-105 transition-transform shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "🔄 Regenerating..." : "🔄 Regenerate with Same Data"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
