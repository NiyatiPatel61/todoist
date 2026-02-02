'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick: () => void;
}

interface User {
  name: string;
  email: string;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="relative flex-1 max-w-md">
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:shadow-lg focus:shadow-teal-100/50 transition-all duration-300 text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-teal-50 rounded-xl transition-all duration-300 hover:scale-110 relative group">
          <svg className="w-6 h-6 text-gray-700 group-hover:text-teal-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-linear-to-br from-teal-500 to-cyan-600 rounded-full ring-2 ring-white animate-pulse"></span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-2 hover:bg-teal-50 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <div className="w-8 h-8 bg-linear-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-teal-500/30 ring-2 ring-white">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-slide-down z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
              <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Settings
              </Link>
              <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Profile
              </Link>
              <hr className="my-2 border-gray-200" />
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/signin';
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
