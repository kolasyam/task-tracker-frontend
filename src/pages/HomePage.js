import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-indigo-600">
      {/* Navbar */}
      <nav className="bg-indigo-600 py-4 px-6 flex justify-between items-center">
        <div className="text-white text-2xl font-bold">TaskTracker</div>
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

      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-white text-5xl font-bold mb-4 leading-tight">
          Manage your tasks
          <br />
          with ease and efficiency
        </h1>
        <p className="text-white text-xl mb-8 max-w-2xl">
          TaskTracker helps you organize your projects, track progress, and
          collaborate with your team effortlessly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/signup"
            className="bg-white text-indigo-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-100"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-indigo-500 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-400"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
