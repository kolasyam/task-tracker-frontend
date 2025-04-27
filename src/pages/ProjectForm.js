import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectForm = () => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // State to hold error message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      alert("Project name is required");
      return;
    }

    setIsLoading(true);
    setError(""); // Clear previous error message
    const token = localStorage.getItem("usertoken");

    try {
      const response = await fetch(
        "https://task-tracker-backend-5wn1.onrender.com/api/project/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: projectName,
            description: description,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to create project"); // Display the error message from backend if available
        throw new Error(data.message || "Failed to create project");
      }

      // Navigate back to dashboard after successful creation
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating project:", error);
      setError(error.message || "Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Project</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="projectName" className="block text-gray-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="projectName"
              placeholder="Enter project name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Describe your project"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Display error message */}
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
