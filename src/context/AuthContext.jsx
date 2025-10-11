// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check localStorage on load
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  // Login function
  const login = async (email, password) => {
    // Here you can replace this with API call
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = savedUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!existingUser) throw new Error("Invalid email or password");

    localStorage.setItem("user", JSON.stringify(existingUser));
    setUser(existingUser);
    return existingUser;
  };

  // Register function
  const register = async (name, email, password) => {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = savedUsers.find((u) => u.email === email);
    if (existingUser) throw new Error("User already exists");

    const newUser = { name, email, password, activity: [] };
    savedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(savedUsers));
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);

    // Update in localStorage users array
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = savedUsers.findIndex((u) => u.email === user.email);
    if (userIndex !== -1) savedUsers[userIndex] = updatedUser;
    localStorage.setItem("users", JSON.stringify(savedUsers));

    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
