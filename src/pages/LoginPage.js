import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://task-tracker-backend-5wn1.onrender.com/api/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.status === 401) {
        throw new Error("Unauthorized: Invalid email or password.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      console.log("data", data);

      localStorage.setItem("usertoken", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-indigo-600 py-4 px-6 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          TaskTracker
        </Link>
        <div className="flex space-x-2">
          <Link
            to="/login"
            className="text-white px-4 py-2 rounded hover:underline"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-indigo-100"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6">
            Sign in to your account
          </h2>
          <p className="text-center mb-6">
            Or{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              create a new account
            </Link>
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading} // disable while loading
              className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                loading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {loading ? "Loading..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
