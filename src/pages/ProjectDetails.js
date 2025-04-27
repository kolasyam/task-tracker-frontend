import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [userProfile, setUserProfile] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Task form state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("To Do");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("usertoken");
    if (!token) return;

    try {
      const response = await fetch(
        `https://task-tracker-backend-5wn1.onrender.com/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const profileData = await response.json();
      setUserProfile(profileData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem("usertoken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `https://task-tracker-backend-5wn1.onrender.com/api/project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }

        const projectData = await response.json();
        setProject(projectData);
      } catch (error) {
        console.error(error);
        setError("Error fetching project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    fetchProject();
  }, [projectId, navigate]);

  const fetchTasks = async () => {
    const token = localStorage.getItem("usertoken");
    if (!token) return;

    try {
      setTasksLoading(true);
      const response = await fetch(
        `https://task-tracker-backend-5wn1.onrender.com/api/tasks/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const tasksData = await response.json();
      setTasks(tasksData);
    } catch (error) {
      console.error(error);
      setError("Error fetching tasks.");
    } finally {
      setTasksLoading(false);
    }
  };

  const handleAddTask = () => {
    // Reset form for new task
    setIsEditing(false);
    setEditingTaskId(null);
    setTaskTitle("");
    setTaskDescription("");
    setTaskStatus("To Do");
    setFormError("");
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim()) {
      setFormError("Title is required");
      return;
    }

    const token = localStorage.getItem("usertoken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      if (isEditing) {
        // Update existing task
        const response = await fetch(
          `https://task-tracker-backend-5wn1.onrender.com/api/tasks/${editingTaskId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: taskTitle,
              description: taskDescription,
              status: taskStatus,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.log("error message", errorData);
          throw new Error(errorData.message || "Failed to update task");
        }
      } else {
        // Create new task
        const response = await fetch(
          `https://task-tracker-backend-5wn1.onrender.com/api/tasks/${projectId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: taskTitle,
              description: taskDescription,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.log("error message", errorData);
          throw new Error(errorData.message || "Failed to create task");
        }
      }

      await fetchTasks(); // Refresh tasks after adding or updating
      setShowTaskForm(false);
      setTaskTitle("");
      setTaskDescription("");
      setTaskStatus("To Do");
      setIsEditing(false);
      setEditingTaskId(null);
    } catch (error) {
      console.error("Error with task:", error);
      // Display the exact error message from the backend
      setFormError(error.message || "Error processing task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTask = (taskId) => {
    // Find the task to edit
    const taskToEdit = tasks.find((task) => task._id === taskId);
    if (!taskToEdit) return;

    // Set form values with task data
    setTaskTitle(taskToEdit.title);
    setTaskDescription(taskToEdit.description || "");
    setTaskStatus(taskToEdit.status || "To Do");
    setIsEditing(true);
    setEditingTaskId(taskId);
    setFormError("");
    setShowTaskForm(true);
  };

  const handleDeleteConfirmation = (taskId, taskTitle) => {
    // Show confirmation dialog
    setDeleteConfirmation({
      taskId,
      taskTitle,
    });
  };

  const handleDeleteTask = async () => {
    if (!deleteConfirmation) return;

    const token = localStorage.getItem("usertoken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(
        `https://task-tracker-backend-5wn1.onrender.com/api/tasks/${deleteConfirmation.taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete task");
      }

      // Remove task from the local state
      setTasks(tasks.filter((task) => task._id !== deleteConfirmation.taskId));
      setDeleteConfirmation(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(error.message || "Error deleting task. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  // Helper function to normalize status values
  const normalizeStatus = (status) => {
    if (!status) return "to-do";

    // Convert status to lowercase and handle different formats
    const lowercaseStatus = status.toLowerCase();

    if (lowercaseStatus === "to do") return "to-do";
    if (lowercaseStatus === "in process" || lowercaseStatus === "in progress")
      return "in-progress";
    if (lowercaseStatus === "completed" || lowercaseStatus === "done")
      return "completed";

    return lowercaseStatus;
  };

  const getFilteredTasks = () => {
    if (filterStatus === "all") return tasks;

    return tasks.filter((task) => {
      const normalizedStatus = normalizeStatus(task.status);
      return normalizedStatus === filterStatus;
    });
  };

  const getStatusCount = (status) => {
    if (status === "all") return tasks.length;

    return tasks.filter((task) => {
      const normalizedStatus = normalizeStatus(task.status);
      return normalizedStatus === status;
    }).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading project...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        {error}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Project not found.
      </div>
    );
  }

  const filteredTasks = getFilteredTasks();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-500 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold">Task Tracker</div>
        <div className="flex items-center">
          <span className="mr-2">Hello, {userProfile?.name || "User"}</span>
        </div>
      </header>

      {/* Project Navigation */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center">
          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-blue-500 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <h1 className="text-xl font-bold ml-2">{project.title}</h1>
        </div>
      </div>

      {/* Task Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="text-gray-600 mr-2">Filter:</span>
          <div className="flex space-x-1">
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                filterStatus === "all"
                  ? "bg-gray-200 font-medium"
                  : "bg-white text-gray-600"
              }`}
              onClick={() => setFilterStatus("all")}
            >
              All ({getStatusCount("all")})
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                filterStatus === "to-do"
                  ? "bg-gray-200 font-medium"
                  : "bg-white text-gray-600"
              }`}
              onClick={() => setFilterStatus("to-do")}
            >
              To Do ({getStatusCount("to-do")})
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                filterStatus === "in-progress"
                  ? "bg-gray-200 font-medium"
                  : "bg-white text-gray-600"
              }`}
              onClick={() => setFilterStatus("in-progress")}
            >
              In Progress ({getStatusCount("in-progress")})
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                filterStatus === "completed"
                  ? "bg-gray-200 font-medium"
                  : "bg-white text-gray-600"
              }`}
              onClick={() => setFilterStatus("completed")}
            >
              Completed ({getStatusCount("completed")})
            </button>
          </div>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={handleAddTask}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 p-6">
        {tasksLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="spinner-border text-blue-500" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{task.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      normalizeStatus(task.status) === "completed"
                        ? "bg-green-100 text-green-800"
                        : normalizeStatus(task.status) === "in-progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {task.status || "To Do"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {task.description || "No description provided"}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {task.createdAt
                      ? new Date(task.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                {/* Task Actions */}
                <div className="flex justify-end gap-2 mt-2 border-t pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTask(task._id);
                    }}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConfirmation(task._id, task.title);
                    }}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-500 mb-4">You don't have any tasks yet.</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={handleAddTask}
            >
              Create Your First Task
            </button>
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-semibold">
                {isEditing ? "Edit Task" : "Create New Task"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitTask} className="p-6">
              {formError && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md">
                  {formError}
                </div>
              )}
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your task"
                  rows="4"
                ></textarea>
              </div>

              {/* Task Status Field - only show when editing */}
              {isEditing && (
                <div className="mb-4">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
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
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : isEditing ? (
                    "Update Task"
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-3">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the task "
                {deleteConfirmation.taskTitle}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
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
                      Deleting...
                    </>
                  ) : (
                    "Delete Task"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
