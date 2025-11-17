import { useState, useEffect, useCallback } from "react";

/**
 * useUserData
 * - Fetches current user's profile from backend (Postgres via your Flask API)
 * - No localStorage used
 * - Works with cookie-based JWT (credentials: 'include') or Authorization Bearer token
 *
 * Usage:
 *   const { userData, loading, error, refetch } = useUserData();
 */
export function useUserData(options = {}) {
  const {
    url = "http://localhost:5000/api/auth/profile", // change if different
    authType = "cookie", // "cookie" or "bearer"
    bearerToken = null, // optional: set if authType === 'bearer'
  } = options;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const headers = { "Content-Type": "application/json" };
      if (authType === "bearer" && bearerToken) {
        headers["Authorization"] = `Bearer ${bearerToken}`;
      }

      const res = await fetch(url, {
        method: "GET",
        credentials: authType === "cookie" ? "include" : "same-origin",
        headers,
        signal,
      });

      if (!res.ok) {
        // Try to parse JSON error message if present
        let errText = `HTTP ${res.status}`;
        try {
          const payload = await res.json();
          if (payload?.message) errText = payload.message;
          else if (payload?.error) errText = payload.error;
        } catch (_) {
          // ignore JSON parse error
        }
        throw new Error(errText);
      }

      const data = await res.json();

      // Normalize fields for frontend: convert numeric to string (if present)
      const normalize = (value) => {
        if (value === null || value === undefined) return "";
        // Keep strings as-is
        if (typeof value === "string") return value;
        // Numbers -> string
        if (typeof value === "number") return String(value);
        // For nested objects or arrays, return as-is
        return value;
      };

      const normalizedUser = {
        id: data.id ?? null,
        username: data.username ?? data.name ?? "",
        email: data.email ?? "",
        height: normalize(data.height),
        weight: normalize(data.weight),
        age: normalize(data.age),
        gender: data.gender ?? "",
        // include any other fields you need from backend
        ...data,
      };

      setUserData(normalizedUser);
      setLoading(false);
      return normalizedUser;
    } catch (err) {
      if (err.name === "AbortError") {
        // fetch was aborted — don't set error
        return;
      }
      console.error("useUserData fetch error:", err);
      setError(err);
      setLoading(false);
    }
  }, [url, authType, bearerToken]);

  useEffect(() => {
    const controller = new AbortController();
    fetchUser(controller.signal);
    return () => controller.abort();
  }, [fetchUser]);

  // Expose a refetch function (useful after profile update / login)
  const refetch = useCallback(() => {
    const controller = new AbortController();
    // call but don't keep controller reference (one-off refetch)
    fetchUser(controller.signal);
    // no cleanup here — leaving the controller to garbage collect is fine for one-off
  }, [fetchUser]);

  return { userData, loading, error, refetch };
}
