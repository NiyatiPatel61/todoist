"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import toast from "react-hot-toast";

interface Project {
  id: string;
  name: string;
  color: string;
  taskLists?: TaskList[];
}

interface TaskList {
  id: string;
  listName: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function NewTaskPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "Pending",
    projectId: "",
    listId: "",
    assignedTo: "",
    dueDate: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/signin");
      return;
    }

    const userData = JSON.parse(user);
    setFormData((prev) => ({ ...prev, assignedTo: userData.id }));

    fetchProjects();
    fetchUsers();
  }, [router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTaskLists = async (projectId: string) => {
    try {
      const response = await fetch(`/api/tasklists?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setTaskLists(data.taskLists);
      }
    } catch (error) {
      console.error("Error fetching task lists:", error);
    }
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = e.target.value;
    setFormData({
      ...formData,
      projectId,
      listId: "",
    });
    if (projectId) {
      fetchTaskLists(projectId);
    } else {
      setTaskLists([]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.listId || !formData.assignedTo) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Task created successfully!");
        router.push("/my-tasks");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("An error occurred while creating the task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        selectedView="tasks"
        setSelectedView={() => {}}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Link
                  href="/dashboard"
                  className="hover:text-teal-600 transition-colors"
                >
                  Dashboard
                </Link>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span>Create New Task</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create New Task
              </h1>
              <p className="text-gray-600">
                Fill in the details below to create a new task
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6"
            >
              {/* Task Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none placeholder-gray-500"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Enter task description..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none resize-none placeholder-gray-500"
                ></textarea>
              </div>

              {/* Priority and Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="priority"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Project and Task List Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="projectId"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Project <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="projectId"
                    name="projectId"
                    required
                    value={formData.projectId}
                    onChange={handleProjectChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="listId"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Task List <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="listId"
                    name="listId"
                    required
                    value={formData.listId}
                    onChange={handleChange}
                    disabled={!formData.projectId}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a task list</option>
                    {taskLists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.listName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assignee and Due Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="assignedTo"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Assign To <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    required
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                  >
                    <option value="">Select assignee</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dueDate"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
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
                    "Create Task"
                  )}
                </button>
              </div>
            </form>

            {/* Quick Tips */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Quick Tips
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use clear, action-oriented task titles</li>
                    <li>• Set realistic due dates to manage expectations</li>
                    <li>
                      • Assign tasks to specific team members for accountability
                    </li>
                    <li>• Add relevant tags to make tasks easier to find</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
