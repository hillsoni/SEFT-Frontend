import axios from "axios";

// Get API base URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      const currentPath = window.location.pathname;
      
      // Only redirect if not already on login/register pages to prevent refresh loops
      if (currentPath !== "/login" && currentPath !== "/register" && currentPath !== "/") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        // Still clear tokens even if we're on login/register
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

// ============= AUTHENTICATION API =============
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.post("/auth/change-password", data),
  verifyToken: () => api.get("/auth/verify"),
};

// ============= DIET API =============
export const dietAPI = {
  generate: (data) => api.post("/diet/generate", data),
  getAll: (params) => api.get("/diet/", { params }),
  getById: (id) => api.get(`/diet/${id}`),
  update: (id, data) => api.put(`/diet/${id}`, data),
  delete: (id) => api.delete(`/diet/${id}`),
  getLatest: () => api.get("/diet/latest"),
  getStatistics: () => api.get("/diet/statistics"),
};

// ============= CHATBOT API =============
export const chatbotAPI = {
  sendQuery: (data) => api.post("/chatbot/query", data),
  getHistory: (params) => api.get("/chatbot/history", { params }),
  getQuery: (id) => api.get(`/chatbot/${id}`),
  deleteQuery: (id) => api.delete(`/chatbot/${id}`),
  clearHistory: (params) => api.delete("/chatbot/history", { params }),
  getStatistics: () => api.get("/chatbot/statistics"),
  quickAsk: (data) => api.post("/chatbot/quick-ask", data),
};

// ============= YOGA API =============
export const yogaAPI = {
  getAll: () => api.get("/yoga/"),
  getById: (id) => api.get(`/yoga/${id}`),
  getByDifficulty: (level) => api.get(`/yoga/difficulty/${level}`),
};

// ============= WORKOUT API =============
export const workoutAPI = {
  getAll: () => api.get("/workouts/"),
  getById: (id) => api.get(`/workouts/${id}`),
};

// ============= EXERCISE API =============
export const exerciseAPI = {
  generate: (data) => api.post("/exercise/generate", data),
  getAll: () => api.get("/exercise/"),
  getById: (id) => api.get(`/exercise/${id}`),
  update: (id, data) => api.put(`/exercise/${id}`, data),
  delete: (id) => api.delete(`/exercise/${id}`),
};

// ============= USER API =============
export const userAPI = {
  getAll: () => api.get("/users/"),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getStats: (id) => api.get(`/users/${id}/stats`),
  search: (params) => api.get("/users/search", { params }),
};

export default api;
