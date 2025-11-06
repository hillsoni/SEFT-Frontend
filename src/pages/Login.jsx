import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const remembered = JSON.parse(localStorage.getItem("rememberMe") || "null");
    if (remembered?.email) {
      setEmail(remembered.email);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        if (remember) {
          localStorage.setItem("rememberMe", JSON.stringify({ email }));
        } else {
          localStorage.removeItem("rememberMe");
        }

        Swal.fire({
          icon: "success",
          title: `Welcome back, ${result.user.username}!`,
          text: `Email: ${result.user.email}`,
          confirmButtonText: "OK",
          background: "#1f2937",
          color: "#fff",
        });

        navigate("/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: result.error || "Invalid email or password",
          confirmButtonText: "OK",
          background: "#1f2937",
          color: "#fff",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back 👋</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full p-3 mb-4 rounded-lg bg-neutral-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full p-3 mb-4 rounded-lg bg-neutral-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
        />

        <div className="flex items-center justify-between text-sm mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              disabled={loading}
              className="w-4 h-4 rounded accent-pink-500"
            />
            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="text-pink-400 hover:text-pink-300 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-orange-500 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-pink-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
