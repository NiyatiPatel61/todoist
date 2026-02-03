"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import toast from "react-hot-toast";

interface TaskList {
  id: string;
  listName: string;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignedUser: {
    id: string;
    name: string;
  };
}

interface Project {
  id: string;
  projectName: string;
  description?: string;
  taskLists: TaskList[];
  creator: {
    name: string;
  };
  createdAt: string;
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks");
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [newListName, setNewListName] = useState("");
  const [showNewListModal, setShowNewListModal] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/signin");
      return;
    }

    fetchProject();
  }, [router, params.id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
      } else {
        toast.error("Failed to fetch project");
        router.push("/projects");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const response = await fetch("/api/tasklists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: params.id,
          listName: newListName,
        }),
      });

      if (response.ok) {
        toast.success("Task list created successfully");
        setNewListName("");
        setShowNewListModal(false);
        fetchProject();
      } else {
        toast.error("Failed to create task list");
      }
    } catch (error) {
      console.error("Error creating task list:", error);
      toast.error("An error occurred");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "inprogress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDeleteProject = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This will delete all tasks.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Project deleted successfully");
        router.push("/projects");
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          selectedView="projects"
          setSelectedView={() => {}}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </main>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const totalTasks = project.taskLists.reduce(
    (sum, list) => sum + list.tasks.length,
    0,
  );
  const completedTasks = project.taskLists.reduce(
    (sum, list) =>
      sum + list.tasks.filter((t) => t.status === "Completed").length,
    0,
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        selectedView="projects"
        setSelectedView={() => {}}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          {/* Project Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Link
                  href="/projects"
                  className="hover:text-teal-600 transition-colors"
                >
                  Projects
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
                <span>{project.projectName}</span>
              </div>

              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {project.projectName}
                  </h1>
                  <p className="text-gray-600 max-w-2xl">
                    {project.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/projects/${project.id}/board`}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                      />
                    </svg>
                    Board View
                  </Link>
                  <button className="px-4 py-2 bg-linear-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-medium hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/30">
                    Add Task
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">
                    Project Progress
                  </span>
                  <span className="font-bold text-gray-900">
                    {Math.round((project.completed / project.tasks) * 100)}%
                    Complete
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: project.color,
                      width: `${(project.completed / project.tasks) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`pb-4 px-2 font-medium transition-all relative ${
                    activeTab === "tasks"
                      ? "text-teal-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Task Lists
                  {activeTab === "tasks" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("members")}
                  className={`pb-4 px-2 font-medium transition-all relative ${
                    activeTab === "members"
                      ? "text-teal-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Members
                  {activeTab === "members" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`pb-4 px-2 font-medium transition-all relative ${
                    activeTab === "activity"
                      ? "text-teal-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Activity
                  {activeTab === "activity" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"></div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "tasks" && (
              <div className="space-y-6">
                {project.taskLists.map((list) => (
                  <div
                    key={list.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">{list.name}</h3>
                      <span className="text-sm text-gray-600">
                        {list.tasks.length} tasks
                      </span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {list.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-4 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                              readOnly
                            />
                            <div className="flex-1">
                              <h4
                                className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"} group-hover:text-teal-600 transition-colors cursor-pointer`}
                              >
                                {task.title}
                              </h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-500">
                                  {task.assignee}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                task.priority === "high"
                                  ? "bg-red-100 text-red-700"
                                  : task.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "members" && (
              <div className="bg-white rounded-2xl border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Project Members
                  </h2>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-all">
                    + Add Member
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {project.members.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {member.avatar}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {member.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {member.role}
                            </p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-red-600 transition-colors">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="bg-white rounded-2xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Activity
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    {
                      action: "completed",
                      user: "John Doe",
                      task: "Define target audience",
                      time: "2 hours ago",
                    },
                    {
                      action: "commented",
                      user: "Jane Smith",
                      task: "Design social media graphics",
                      time: "4 hours ago",
                    },
                    {
                      action: "created",
                      user: "Sarah Wilson",
                      task: "Schedule social media posts",
                      time: "1 day ago",
                    },
                    {
                      action: "assigned",
                      user: "Mike Johnson",
                      task: "Setup email campaigns",
                      time: "2 days ago",
                    },
                  ].map((activity, idx) => (
                    <div
                      key={idx}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.action === "completed"
                              ? "bg-green-100"
                              : activity.action === "commented"
                                ? "bg-blue-100"
                                : activity.action === "created"
                                  ? "bg-teal-100"
                                  : "bg-purple-100"
                          }`}
                        >
                          {activity.action === "completed" && (
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user}</span>{" "}
                            {activity.action}{" "}
                            <span className="font-medium">{activity.task}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
