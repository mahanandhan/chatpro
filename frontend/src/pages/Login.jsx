import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        { username, password },
        { withCredentials: true }
      );

      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      window.location.href = "/chat";
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-white flex justify-center items-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-10 w-96 flex flex-col items-center text-center border border-gray-200"
      >
        <h1 className="text-4xl font-bold text-gray-700 mb-2 tracking-wide">
          Welcome Back
        </h1>
        <p className="text-gray-500 mb-6 text-sm">Sign in to continue</p>

        <div className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-100 text-gray-700 placeholder:text-gray-400 py-3 px-5 rounded-xl w-full outline-none border border-gray-200 focus:border-blue-500 focus:bg-white transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-100 text-gray-700 placeholder:text-gray-400 py-3 px-5 rounded-xl w-full outline-none border border-gray-200 focus:border-blue-500 focus:bg-white transition"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3 bg-red-50 border border-red-200 px-3 py-1 rounded-lg">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-lg py-3 rounded-xl shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
        >
          Login
        </button>

        <p className="text-gray-500 text-sm mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
