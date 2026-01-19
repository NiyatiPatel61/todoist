'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TaskList from './TaskList';
import Header from './Header';

export default function Dashboard() {
  const [selectedView, setSelectedView] = useState('today');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        selectedView={selectedView} 
        setSelectedView={setSelectedView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <TaskList view={selectedView} />
        </main>
      </div>
    </div>
  );
}
