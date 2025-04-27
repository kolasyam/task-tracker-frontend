import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("usertoken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userResponse = await fetch(
          "https://task-tracker-backend-5wn1.onrender.com/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!userResponse.ok) throw new Error("Failed to fetch user profile");

        const userData = await userResponse.json();
        setUser(userData);

        const projectsResponse = await fetch(
          "https://task-tracker-backend-5wn1.onrender.com/api/project/getprojects",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!projectsResponse.ok) throw new Error("Failed to fetch projects");

        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("usertoken");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("usertoken");
    navigate("/login");
  };

  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("usertoken");

    try {
      setProjectsLoading(true);
      const response = await fetch(
        `https://task-tracker-backend-5wn1.onrender.com/api/project/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      // After deleting, update the UI
      setProjects((prev) =>
        prev.filter((project) => project._id !== projectId)
      );
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to delete project. Try again.");
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleNewProject = () => {
    // Navigate to create project page or open modal
    // For now just a placeholder
    navigate("/create-project");
    console.log("Create new project");
  };
  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold">Task Tracker</div>
        <div className="flex items-center gap-2">
          <span>Hello, {user?.name || "User"}</span>
          <button onClick={handleLogout} className="ml-4">
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
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Projects</h1>
          <button
            onClick={handleNewProject}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            New Project
          </button>
        </div>

        {projectsLoading ? (
          <div className="text-center py-10">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-2 text-center py-10 text-gray-500">
                No projects yet. Create your first project!
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded rounded-lg shadow p-4 border border-gray-200 relative group cursor-pointer hover:border-blue-400"
                  onClick={() => handleProjectClick(project._id)}
                >
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                    aria-label="Delete project"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                  <h2 className="text-xl font-semibold mb-2">
                    {project.title || "Task Tracker"}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {project.description ||
                      "asdfkl dalfj sadfl sldfkj asldj adkjfadsf"}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Created on{" "}
                    {project.createdAt
                      ? new Date(project.createdAt).toLocaleDateString()
                      : "4/26/2025"}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
