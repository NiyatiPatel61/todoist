'use client';

import { useState } from 'react';

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

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  getPriorityColor: (priority: number) => string;
  getPriorityLabel: (priority: number) => string;
}

export default function TaskItem({ task, onToggle, onDelete, getPriorityColor, getPriorityLabel }: TaskItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date('2026-01-09');
    const tomorrow = new Date('2026-01-10');
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date('2026-01-09') && !task.completed;

  return (
    <div
      className={`
        bg-white border rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-teal-100/50 hover:-translate-y-0.5
        ${task.completed ? 'border-gray-100 opacity-75' : 'border-gray-200 hover:border-teal-200'}
        ${showDetails ? 'shadow-lg shadow-teal-100/50 border-teal-200' : ''}
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(task.id)}
            className={`
              flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-300 mt-0.5
              ${task.completed
                ? 'bg-gradient-to-br from-teal-500 to-cyan-600 border-teal-500 scale-110'
                : 'border-gray-300 hover:border-teal-500 hover:bg-teal-50 hover:scale-110'
              }
              flex items-center justify-center cursor-pointer
            `}
          >
            {task.completed && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3
                  onClick={() => setShowDetails(!showDetails)}
                  className={`
                    text-base font-medium cursor-pointer
                    ${task.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-900 hover:text-teal-600'
                    }
                  `}
                >
                  {task.title}
                </h3>
                
                {task.description && !task.completed && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 hover:scale-110"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  
                  {showMenu && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 animate-slide-down">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Edit
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Duplicate
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Move to project
                      </button>
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={() => {
                          onDelete(task.id);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {task.dueDate && (
                <span className={`
                  text-xs px-2 py-1 rounded flex items-center gap-1
                  ${isOverdue
                    ? 'bg-red-100 text-red-700'
                    : task.completed
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-teal-50 text-teal-700'
                  }
                `}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(task.dueDate)}
                </span>
              )}

              {task.priority > 1 && !task.completed && (
                <span className={`text-xs font-medium flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  {getPriorityLabel(task.priority)}
                </span>
              )}

              {task.project && (
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${task.projectColor}`}></span>
                  {task.project}
                </span>
              )}
            </div>

            {/* Expanded details */}
            {showDetails && task.description && !task.completed && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  {task.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
