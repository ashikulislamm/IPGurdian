// AuthContext.js
import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  // Set up axios interceptors for automatic token handling
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    
    // Also check if user data exists in localStorage on app start
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse stored user data:", err);
        localStorage.removeItem("user");
      }
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user: userData } = res.data;
      
      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Set authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      setUser(userData);
      return { success: true, data: res.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.msg || "Login failed" 
      };
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/auth/profile");
      
      const userData = res.data.user;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, data: userData };
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      return { 
        success: false, 
        error: err.response?.data?.msg || "Failed to fetch profile" 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      const res = await axios.put("http://localhost:5000/api/auth/profile", profileData);
      
      const userData = res.data.user;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, data: userData, message: res.data.msg };
    } catch (err) {
      console.error("Failed to update profile:", err);
      return { 
        success: false, 
        error: err.response?.data?.msg || "Failed to update profile" 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser, 
        login, 
        logout, 
        fetchUserProfile, 
        updateUserProfile, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
