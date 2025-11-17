import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    mobile_number: "",
    height: "",      // ✅ Added
    weight: "",      // ✅ Added
    age: "",         // ✅ Added (optional but recommended)
    gender: "",      // ✅ Added (optional but recommended)
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await register(formData);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: `Welcome, ${result.user.username}!`,
          text: "Account created successfully.",
          confirmButtonText: "OK",
          background: "#1f2937",
          color: "#fff",
        });

        navigate("/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration failed",
          text: result.error || "An error occurred",
          confirmButtonText: "OK",
          background: "#1f2937",
          color: "#fff",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: err.message || "An error occurred",
        confirmButtonText: "OK",
        background: "#1f2937",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account ✨</h2>

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full p-3 mb-4 rounded-lg bg-neutral-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full p-3 mb-4 rounded-lg bg-neutral-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full p-3 mb-4 rounded-lg bg-neutral-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
        />

        {/* Mobile Number */}
        <input
          type="tel"
          name="mobile_number"
          placeholder="Mobile Number (Optional)"
          value={formData.mobile_number}
          onChange={handleChange}
          disabled={loading}
          className="w-full p-3 mb-4 rounded-lg bg-neutral-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
        />

        {/* Age */}
        <input
          type="number"
          name="age"
          placeholder="Age (Optional)"
          value={formData.age}
          onChange={handleChange}
          min="10"
          max="120"
          disabled={loading}
          className="w-full p-3 mb-4 rounded-lg bg-neutral-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
        />

        {/* Gender */}
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          disabled={loading}
          className="w-full p-3 mb-4 rounded-lg bg-neutral-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
        >
          <option value="">Select Gender (Optional)</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {/* Height - REQUIRED for fitness app */}
        <input
          type="number"
          name="height"
          placeholder="Height (cm) *"
          value={formData.height}
          onChange={handleChange}
          required
          min="100"
          max="250"
          step="0.1"
          disabled={loading}
          className="w-full p-3 mb-4 rounded-lg bg-neutral-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
        />

        {/* Weight - REQUIRED for fitness app */}
        <input
          type="number"
          name="weight"
          placeholder="Weight (kg) *"
          value={formData.weight}
          onChange={handleChange}
          required
          min="30"
          max="300"
          step="0.1"
          disabled={loading}
          className="w-full p-3 mb-4 rounded-lg bg-neutral-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
        />

        <p className="text-xs text-gray-400 mb-4">* Required fields for personalized fitness plans</p>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-orange-500 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;