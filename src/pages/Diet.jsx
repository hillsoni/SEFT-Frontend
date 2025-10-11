// pages/Diet.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function DietPlanPage() {
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/diet-result", { state: formData });
  };

  return (
    <section className="px-6 py-16 max-w-4xl mx-auto mt-8 ">
      <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
        Build Your Personalized Diet Plan 🥗
      </h1>

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
          className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 shadow-lg hover:scale-105 transition-transform"
        >
          Generate Diet Plan 🚀
        </button>
      </form>
    </section>
  );
}
