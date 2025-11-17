// pages/Diet.jsx
import React, { useState, useEffect } from "react";
import { dietAPI } from "../api";
import Swal from "sweetalert2";
import { useChatbot } from "../context/ChatbotContext";
import DynamicDietPlanDisplay from "../components/DynamicDietPlanDisplay";

export function DietPlanPage() {
  const [loading, setLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const { extractedInfo } = useChatbot();
  
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

  // Load user's height and weight from localStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.height || user.weight) {
          setFormData((prev) => ({
            ...prev,
            height: user.height ? user.height.toString() : "",
            weight: user.weight ? user.weight.toString() : "",
            age: user.age ? user.age.toString() : "",
            gender: user.gender || "",
          }));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  // Apply extracted info from chatbot
  useEffect(() => {
    if (Object.keys(extractedInfo).length > 0) {
      setFormData((prev) => {
        const updated = { ...prev };
        if (extractedInfo.age && !prev.age) updated.age = extractedInfo.age.toString();
        if (extractedInfo.weight && !prev.weight) updated.weight = extractedInfo.weight.toString();
        if (extractedInfo.height && !prev.height) updated.height = extractedInfo.height.toString();
        if (extractedInfo.gender && !prev.gender) updated.gender = extractedInfo.gender;
        if (extractedInfo.activity_level && !prev.activity_level) updated.activity_level = extractedInfo.activity_level;
        if (extractedInfo.goal && !prev.goal) updated.goal = extractedInfo.goal;
        if (extractedInfo.diet_type && !prev.diet_type) updated.diet_type = extractedInfo.diet_type;
        return updated;
      });
    }
  }, [extractedInfo]);

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

      console.log("Sending diet plan request:", apiData);

      // Call backend API
      const response = await dietAPI.generate(apiData);
      console.log("Received response:", response.data);

      // Extract the diet plan from response
      // Backend should return: { diet_plan: { id, plan, created_at, ... } }
      const generatedPlan = response.data.diet_plan;

      // The 'plan' field contains the Gemini-generated data
      // It could be a JSON object or a string, handle both
      let planData = generatedPlan.plan;
      
      // If plan is a string, try to parse it
      if (typeof planData === 'string') {
        try {
          planData = JSON.parse(planData);
        } catch (e) {
          // If parsing fails, keep it as string
          console.log("Plan is a text string, will display as-is");
        }
      }

      // Store the diet plan
      setDietPlan({
        formData: formData,
        plan: planData, // This is what Gemini returned (JSON or text)
        id: generatedPlan.id,
        created_at: generatedPlan.created_at
      });
      
      setShowResults(true);
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('diet-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (error) {
      console.error("Diet plan generation error:", error);
      Swal.fire({
        icon: "error",
        title: "Generation Failed",
        text:
          error.response?.data?.error ||
          error.message ||
          "Failed to generate diet plan. Please try again later.",
        confirmButtonText: "OK",
        background: "#1f2937",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto mt-8">
      <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
        Build Your Personalized Diet Plan 🥗
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-gray-900 p-10 rounded-2xl shadow-xl"
      >
        {/* Age */}
        <div>
          <label className="block text-gray-300 mb-2">Age *</label>
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
          <label className="block text-gray-300 mb-2">Gender *</label>
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
          <label className="block text-gray-300 mb-2">Weight (kg) *</label>
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
          <label className="block text-gray-300 mb-2">Height (cm) *</label>
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
          <label className="block text-gray-300 mb-2">Activity Level *</label>
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
          <label className="block text-gray-300 mb-2">Goal *</label>
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
          <label className="block text-gray-300 mb-2">Preferred Diet Type *</label>
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

        {/* Optional: Vegetarian Type */}
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

        {/* Optional: Cuisine */}
        <div>
          <label className="block text-gray-300 mb-2">Preferred Cuisine (Optional)</label>
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

        {/* Optional: Taste */}
        <div>
          <label className="block text-gray-300 mb-2">Taste Preference (Optional)</label>
          <select
            name="taste"
            value={formData.taste}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select Taste</option>
            <option value="sweet">Sweet</option>
            <option value="spicy">Spicy</option>
            <option value="salty">Salty</option>
            <option value="sour">Sour</option>
            <option value="bitter">Bitter</option>
            <option value="balanced">Balanced</option>
          </select>
        </div>

        {/* Optional: Mood Food */}
        <div>
          <label className="block text-gray-300 mb-2">Mood-Based Food (Optional)</label>
          <select
            name="mood_food"
            value={formData.mood_food}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Mood Food</option>
            <option value="calming">Foods to keep calm & reduce anger</option>
            <option value="energizing">Foods to boost energy & focus</option>
            <option value="digestive">Foods for better digestion</option>
            <option value="immunity">Foods for immunity & wellness</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-gray-300 mb-2">Plan Duration *</label>
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
              <span>Generating Your Plan...</span>
            </div>
          ) : (
            "Generate Diet Plan 🚀"
          )}
        </button>
      </form>

      {/* Diet Plan Results - Only show when data is available */}
      {showResults && dietPlan && (
        <div id="diet-results" className="mt-12 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Your Personalized Diet Plan 🍴
            </h2>
            <button
              onClick={() => {
                setShowResults(false);
                setDietPlan(null);
              }}
              className="text-gray-400 hover:text-white transition"
            >
              ✕ Close
            </button>
          </div>

          {/* User Info Summary */}
          <div className="bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-700">
            <h3 className="text-2xl font-semibold mb-6 text-pink-400">📋 Your Profile</h3>
            <ul className="text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
              <li>👤 Age: {dietPlan.formData.age}</li>
              <li>⚧ Gender: {dietPlan.formData.gender}</li>
              <li>⚖️ Weight: {dietPlan.formData.weight} kg</li>
              <li>📏 Height: {dietPlan.formData.height} cm</li>
              <li>🏃 Activity: {dietPlan.formData.activity_level}</li>
              <li>🎯 Goal: {dietPlan.formData.goal.replace("_", " ")}</li>
              <li>🥗 Diet Type: {dietPlan.formData.diet_type}</li>
              {dietPlan.formData.veg_type && <li>🌱 Veg Type: {dietPlan.formData.veg_type}</li>}
              {dietPlan.formData.cuisine && <li>🍛 Cuisine: {dietPlan.formData.cuisine}</li>}
              {dietPlan.formData.taste && <li>😋 Taste: {dietPlan.formData.taste}</li>}
              {dietPlan.formData.mood_food && <li>🧘 Mood-Food: {dietPlan.formData.mood_food}</li>}
              <li>⏳ Duration: {dietPlan.formData.duration.replace("_", " ")}</li>
              <li className="sm:col-span-2">
                ❤️ Health Conditions: {dietPlan.formData.health_conditions.length > 0 ? dietPlan.formData.health_conditions.join(", ") : "None"}
              </li>
            </ul>
          </div>

          {/* Dynamic Diet Plan Display - Handles any format */}
          <DynamicDietPlanDisplay 
            dietPlan={dietPlan.plan} 
            userInfo={dietPlan.formData}
          />

          {/* Generate Again Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => {
                setShowResults(false);
                setDietPlan(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 px-10 py-3 rounded-2xl font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              🔄 Generate New Plan
            </button>
          </div>
        </div>
      )}
    </section>
  );
}