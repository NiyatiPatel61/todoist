'use client';

import { useState } from 'react';
import TaskItem from './TaskItem';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: number;
  dueDate?: string;
  project?: string;
  projectColor?: string;
}

// Dummy data
const dummyTasks: Task[] = [
  {
    id: 1,
    title: 'Review project proposal',
    description: 'Go through the new client proposal and provide feedback',
    completed: false,
    priority: 4,
    dueDate: '2026-01-09',
    project: 'Work',
    projectColor: 'bg-green-500',
  },
  {
    id: 2,
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, vegetables',
    completed: false,
    priority: 2,
    dueDate: '2026-01-09',
    project: 'Shopping',
    projectColor: 'bg-purple-500',
  },
  {
    id: 3,
    title: 'Gym session',
    description: 'Cardio and strength training',
    completed: true,
    priority: 3,
    dueDate: '2026-01-09',
    project: 'Health',
    projectColor: 'bg-red-500',
  },
  {
    id: 4,
    title: 'Call mom',
    completed: false,
    priority: 2,
    dueDate: '2026-01-10',
    project: 'Personal',
    projectColor: 'bg-blue-500',
  },
  {
    id: 5,
    title: 'Finish React documentation',
    description: 'Complete reading the advanced hooks section',
    completed: false,
    priority: 3,
    dueDate: '2026-01-10',
    project: 'Work',
    projectColor: 'bg-green-500',
  },
  {
    id: 6,
    title: 'Book dentist appointment',
    completed: false,
    priority: 2,
    dueDate: '2026-01-11',
    project: 'Health',
    projectColor: 'bg-red-500',
  },
  {
    id: 7,
    title: 'Prepare presentation slides',
    description: 'Q1 performance review presentation',
    completed: false,
    priority: 4,
    dueDate: '2026-01-12',
    project: 'Work',
    projectColor: 'bg-green-500',
  },
  {
    id: 8,
    title: 'Water plants',
    completed: false,
    priority: 1,
    project: 'Personal',
    projectColor: 'bg-blue-500',
  },
];

interface TaskListProps {
  view: string;
}

export default function TaskList({ view }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

  const getViewTitle = () => {
    if (view === 'inbox') return 'Inbox';
    if (view === 'today') return 'Today';
    if (view === 'upcoming') return 'Upcoming';
    if (view.startsWith('project-')) {
      const projectNames = ['', 'Personal', 'Work', 'Shopping', 'Health'];
      const projectId = parseInt(view.split('-')[1]);
      return projectNames[projectId] || 'Project';
    }
    return 'Tasks';
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 4: return 'text-red-500';
      case 3: return 'text-orange-500';
      case 2: return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 4: return 'Urgent';
      case 3: return 'High';
      case 2: return 'Medium';
      default: return 'Low';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (!showCompleted && task.completed) return false;
    
    if (view === 'today') {
      return task.dueDate === '2026-01-09';
    }
    if (view === 'upcoming') {
      return task.dueDate && task.dueDate >= '2026-01-10';
    }
    if (view.startsWith('project-')) {
      const projectId = parseInt(view.split('-')[1]);
      const projectNames = ['', 'Personal', 'Work', 'Shopping', 'Health'];
      return task.project === projectNames[projectId];
    }
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      return b.priority - a.priority;
    }
    if (a.dueDate && b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  const activeTasks = sortedTasks.filter(t => !t.completed);
  const completedTasks = sortedTasks.filter(t => t.completed);

  return (
    <main className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">\n        {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{getViewTitle()}</h1>
        <p className="text-gray-500">
          {activeTasks.length} task{activeTasks.length !== 1 ? 's' : ''} remaining
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border-2 border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSortBy('date')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              sortBy === 'date'
                ? 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border-2 border-teal-200 shadow-md shadow-teal-100/50'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50 hover:border-teal-200 hover:shadow-md'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Date
          </button>
          <button
            onClick={() => setSortBy('priority')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              sortBy === 'priority'
                ? 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border-2 border-teal-200 shadow-md shadow-teal-100/50'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50 hover:border-teal-200 hover:shadow-md'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            Priority
          </button>
        </div>

        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer transition-all duration-300"
          />
          <span className="text-sm text-gray-600 group-hover:text-teal-600 transition-colors duration-300">Show completed</span>
        </label>
      </div>

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="mb-8 space-y-2">
          {activeTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              getPriorityColor={getPriorityColor}
              getPriorityLabel={getPriorityLabel}
            />
          ))}
        </div>
      )}

      {/* Completed Tasks */}
      {showCompleted && completedTasks.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Completed ({completedTasks.length})
          </h2>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                getPriorityColor={getPriorityColor}
                getPriorityLabel={getPriorityLabel}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeTasks.length === 0 && (!showCompleted || completedTasks.length === 0) && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-teal-50 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All clear!</h3>
          <p className="text-gray-500">You don't have any tasks yet. Create one to get started.</p>
        </div>
      )}
      </div>
    </main>
  );
}
