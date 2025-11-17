// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Try to get user from localStorage first (faster, no network call)
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUser(user);
        } catch (e) {
          console.error("Failed to parse stored user:", e);
        }
      }

      // Verify token with backend (but don't block if it fails)
      try {
        const response = await authAPI.verifyToken();
        if (response.data.valid && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          // Token invalid, clear everything
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        // Backend might be down or token invalid
        // If we have a stored user, keep them logged in (for offline mode)
        // Otherwise, clear everything
        if (!storedUser) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          setUser(null);
        }
        console.warn("Token verification failed (backend may be down):", error.message);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, user } = response.data;

      // Store token and user
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { success: true, user };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Login failed";
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { access_token, user } = response.data;

      // Store token and user
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { success: true, user };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Registration failed";
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      setUser(null);
      // Redirect will be handled by the component using logout
      window.location.href = "/";
    }
  };

  const updateUser = async (userData) => {
    try {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUserData = { ...currentUser, ...userData };
    
    const response = await authAPI.updateProfile(userData);
    const updatedUser = response.data.user || updatedUserData;
    
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    return { success: true, user: updatedUser };
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.message || "Update failed";
    return { success: false, error: errorMessage };
  }
};

  const changePassword = async (oldPassword, newPassword) => {
    try {
      await authAPI.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Password change failed";
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
