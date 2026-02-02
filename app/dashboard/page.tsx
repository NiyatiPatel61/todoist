"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Link from "next/link";

interface Stats {
  totalTasks: number;
  completedToday: number;
  inProgress: number;
  overdue: number;
}

interface AssignedTask {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string;
  project: string;
  projectId: string;
  listName: string;
}

interface Activity {
  action: string;
  task: string;
  time: string;
  user: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedToday: 0,
    inProgress: 0,
    overdue: 0,
  });
  const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/signin");
    } else {
      setUser(JSON.parse(userData));
      fetchDashboardData();
    }
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats and assigned tasks
      const statsResponse = await fetch("/api/dashboard/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
        setAssignedTasks(statsData.assignedTasks);
      }

      // Fetch activity
      const activityResponse = await fetch("/api/dashboard/activity");
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setActivities(activityData.activities);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) return "Today";
    if (date.getTime() === tomorrow.getTime()) return "Tomorrow";

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh dashboard data
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        selectedView="dashboard"
        setSelectedView={() => {}}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your tasks today.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          ) : (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-teal-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      Total
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {stats.totalTasks}
                  </h3>
                  <p className="text-sm text-gray-600">All tasks</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      Today
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {stats.completedToday}
                  </h3>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      Active
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {stats.inProgress}
                  </h3>
                  <p className="text-sm text-gray-600">In progress</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      Overdue
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {stats.overdue}
                  </h3>
                  <p className="text-sm text-gray-600">Need attention</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* My Assigned Tasks */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                      My Assigned Tasks
                    </h2>
                    <Link
                      href="/tasks/new"
                      className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
                    >
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Quick Add
                    </Link>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {assignedTasks.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <svg
                          className="w-16 h-16 mx-auto mb-4 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <p className="text-lg font-medium mb-2">
                          No tasks assigned yet
                        </p>
                        <p className="text-sm">
                          Create a new task to get started
                        </p>
                      </div>
                    ) : (
                      assignedTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() =>
                                handleToggleTask(task.id, task.status)
                              }
                              className={`mt-1 w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                                task.status === "Completed"
                                  ? "bg-teal-600 border-teal-600"
                                  : "border-gray-300 hover:border-teal-500"
                              }`}
                            >
                              {task.status === "Completed" && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <h3
                                className={`font-medium transition-colors ${
                                  task.status === "Completed"
                                    ? "line-through text-gray-400"
                                    : "text-gray-900 group-hover:text-teal-600"
                                }`}
                              >
                                {task.title}
                              </h3>
                              {task.description &&
                                task.status !== "Completed" && (
                                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-500">
                                  {task.project}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">
                                  {formatDueDate(task.dueDate)}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getPriorityClass(task.priority)}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 text-center">
                    <Link
                      href="/my-tasks"
                      className="text-sm font-medium text-teal-600 hover:text-teal-700"
                    >
                      View all tasks →
                    </Link>
                  </div>
                </div>

                {/* Recent Project Activity & Quick Create */}
                <div className="space-y-6">
                  {/* Quick Task Creation */}
                  <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white">
                    <h2 className="text-lg font-bold mb-3">
                      Quick Task Creation
                    </h2>
                    <p className="text-teal-50 text-sm mb-4">
                      Create a new task in seconds
                    </p>
                    <Link
                      href="/tasks/new"
                      className="block w-full bg-white text-teal-600 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-all text-center"
                    >
                      + Create Task
                    </Link>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-bold text-gray-900">
                        Recent Activity
                      </h2>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                      {activities.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <svg
                            className="w-16 h-16 mx-auto mb-4 text-gray-300"
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
                          <p className="text-sm">No recent activity</p>
                        </div>
                      ) : (
                        activities.map((activity, idx) => (
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
                                {activity.action === "commented" && (
                                  <svg
                                    className="w-4 h-4 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                    />
                                  </svg>
                                )}
                                {activity.action === "created" && (
                                  <svg
                                    className="w-4 h-4 text-teal-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                )}
                                {activity.action === "assigned" && (
                                  <svg
                                    className="w-4 h-4 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900">
                                  <span className="font-medium">
                                    {activity.user}
                                  </span>{" "}
                                  {activity.action}{" "}
                                  <span className="font-medium">
                                    {activity.task}
                                  </span>
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {activity.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
