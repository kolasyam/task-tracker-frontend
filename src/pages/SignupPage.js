import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://task-tracker-backend-5wn1.onrender.com/api/user/register",
        {
          name,
          email,
          country,
          password,
        }
      );

      const userData = response.data;
      console.log(userData); // Log user details

      // Store token in localStorage
      localStorage.setItem("usertoken", userData.token);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Signup Form */}
      <div className="flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6">
            Create your account
          </h2>
          <p className="text-center mb-6">
            Or{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              login to your existing account
            </Link>
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Country</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">Select your country</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="India">India</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Other">Other</option>
              </select>
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
            {/* <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Register
            </button> */}
            <button
              type="submit"
              disabled={loading} // disable while loading
              className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                loading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {loading ? "Loading..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
