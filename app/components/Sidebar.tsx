'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  selectedView: string;
  setSelectedView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const projects = [
  { id: 1, name: 'Marketing Campaign', color: '#EF4444', count: 12 },
  { id: 2, name: 'Website Redesign', color: '#3B82F6', count: 24 },
  { id: 3, name: 'API Development', color: '#10B981', count: 18 },
  { id: 4, name: 'Mobile App', color: '#F59E0B', count: 30 },
];

export default function Sidebar({ selectedView, setSelectedView, isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const [showProjects, setShowProjects] = useState(true);

  const menuItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard', href: '/dashboard' },
    { id: 'my-tasks', icon: '✅', label: 'My Tasks', href: '/my-tasks', count: 8 },
    { id: 'projects', icon: '📁', label: 'Projects', href: '/projects', count: 4 },
    { id: 'users', icon: '👥', label: 'Team Members', href: '/users' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Todoist</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Add Task Button */}
        <div className="p-4">
          <Link href="/tasks/new" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-4 rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:-translate-y-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">Add Task</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => setSelectedView(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300
                    ${selectedView === item.id 
                      ? 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-600 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1'
                    }
                  `}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </span>
                  {item.count !== undefined && (
                    <span className={`
                      text-xs font-medium px-2 py-0.5 rounded-full
                      ${selectedView === item.id 
                        ? 'bg-teal-100 text-teal-600' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {item.count}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Projects Section */}
          <div className="mt-6">
            <button
              onClick={() => setShowProjects(!showProjects)}
              className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2 font-semibold text-sm">
                <svg
                  className={`w-4 h-4 transition-transform ${showProjects ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Projects
              </span>
              <Link href="/projects" className="p-1 hover:bg-gray-200 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </button>

            {showProjects && (
              <ul className="mt-1 space-y-1 ml-2">
                {projects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/projects/${project.id}`}
                      onClick={() => setSelectedView(`project-${project.id}`)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-300
                        ${selectedView === `project-${project.id}`
                          ? 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:translate-x-1'
                        }
                      `}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }}></span>
                        <span className="text-sm">{project.name}</span>
                      </span>
                      <span className="text-xs text-gray-500">{project.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => {
              localStorage.removeItem('user');
              router.push('/signin');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
