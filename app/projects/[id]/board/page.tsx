'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'inprogress' | 'completed';
  assignee: string;
  dueDate?: string;
}

export default function KanbanBoardPage() {
  const router = useRouter();
  const params = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Define target audience', description: 'Research and define our target market', priority: 'high', status: 'completed', assignee: 'John Doe', dueDate: '2026-01-20' },
    { id: 2, title: 'Create marketing strategy', description: 'Develop comprehensive marketing plan', priority: 'high', status: 'completed', assignee: 'Sarah Wilson', dueDate: '2026-01-22' },
    { id: 3, title: 'Design social media graphics', description: 'Create branded graphics for social platforms', priority: 'medium', status: 'inprogress', assignee: 'Jane Smith', dueDate: '2026-01-28' },
    { id: 4, title: 'Create email templates', description: 'Design responsive email templates', priority: 'medium', status: 'inprogress', assignee: 'Jane Smith', dueDate: '2026-01-30' },
    { id: 5, title: 'Write blog posts', description: 'Create 5 blog posts for campaign', priority: 'high', status: 'inprogress', assignee: 'Tom Brown', dueDate: '2026-02-05' },
    { id: 6, title: 'Schedule social media posts', description: 'Plan and schedule posts for next month', priority: 'medium', status: 'pending', assignee: 'Sarah Wilson', dueDate: '2026-02-10' },
    { id: 7, title: 'Setup email campaigns', description: 'Configure automated email sequences', priority: 'high', status: 'pending', assignee: 'Mike Johnson', dueDate: '2026-02-12' },
    { id: 8, title: 'Create landing page', description: 'Design and develop campaign landing page', priority: 'urgent', status: 'pending', assignee: 'Mike Johnson', dueDate: '2026-01-29' },
  ]);

  const project = {
    name: 'Marketing Campaign',
    color: '#EF4444',
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/signin');
    }
  }, [router]);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: 'pending' | 'inprogress' | 'completed') => {
    if (draggedTask) {
      setTasks(tasks.map(task =>
        task.id === draggedTask.id ? { ...task, status } : task
      ));
      setDraggedTask(null);
    }
  };

  const getTasksByStatus = (status: 'pending' | 'inprogress' | 'completed') => {
    return tasks.filter(task => task.status === status);
  };

  const columns = [
    { id: 'pending', title: 'Pending', status: 'pending' as const, color: 'bg-gray-100', headerColor: 'bg-gray-200' },
    { id: 'inprogress', title: 'In Progress', status: 'inprogress' as const, color: 'bg-blue-50', headerColor: 'bg-blue-100' },
    { id: 'completed', title: 'Completed', status: 'completed' as const, color: 'bg-green-50', headerColor: 'bg-green-100' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
        
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link href="/projects" className="hover:text-teal-600 transition-colors">Projects</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href={`/projects/${params.id}`} className="hover:text-teal-600 transition-colors">{project.name}</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Board</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                  style={{ backgroundColor: project.color }}
                >
                  {project.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{project.name} - Task Board</h1>
                  <p className="text-sm text-gray-600">Drag and drop tasks to update their status</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/projects/${params.id}`}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  List View
                </Link>
                <button className="px-4 py-2 bg-linear-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-medium hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/30">
                  + Add Task
                </button>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
            <div className="flex gap-6 h-full min-w-max">
              {columns.map((column) => (
                <div
                  key={column.id}
                  className="flex-1 min-w-[320px] max-w-100 flex flex-col"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(column.status)}
                >
                  {/* Column Header */}
                  <div className={`${column.headerColor} rounded-t-2xl px-4 py-3 border-2 border-gray-200`}>
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-gray-900 flex items-center gap-2">
                        <span>{column.title}</span>
                        <span className="text-sm font-normal bg-white px-2 py-0.5 rounded-full">
                          {getTasksByStatus(column.status).length}
                        </span>
                      </h2>
                      <button className="text-gray-600 hover:text-gray-900">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Tasks Container */}
                  <div className={`flex-1 ${column.color} rounded-b-2xl border-x-2 border-b-2 border-gray-200 p-4 overflow-y-auto space-y-3`}>
                    {getTasksByStatus(column.status).map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-move group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors flex-1 pr-2">
                            {task.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-linear-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                              {task.assignee.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-xs text-gray-600">{task.assignee}</span>
                          </div>
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {getTasksByStatus(column.status).length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-sm">No tasks</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
