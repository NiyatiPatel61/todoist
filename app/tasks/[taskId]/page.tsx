'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const task = {
    id: params.taskId,
    title: 'Design social media graphics',
    description: 'Create branded graphics for all social media platforms including Facebook, Instagram, Twitter, LinkedIn. Graphics should follow brand guidelines and be optimized for each platform.',
    status: 'inprogress',
    priority: 'high',
    assignee: { name: 'Jane Smith', avatar: 'JS' },
    creator: { name: 'John Doe', avatar: 'JD' },
    project: { id: 1, name: 'Marketing Campaign', color: '#EF4444' },
    dueDate: '2026-01-28',
    createdAt: '2026-01-15',
    tags: ['design', 'social-media', 'branding'],
    attachments: [
      { name: 'brand-guidelines.pdf', size: '2.5 MB', type: 'pdf' },
      { name: 'mockup-v1.png', size: '1.2 MB', type: 'image' },
    ],
    comments: [
      { id: 1, user: 'John Doe', avatar: 'JD', text: 'Please make sure to include the new logo in all graphics.', time: '2 hours ago' },
      { id: 2, user: 'Jane Smith', avatar: 'JS', text: 'Working on it! Should have the first drafts ready by EOD.', time: '1 hour ago' },
      { id: 3, user: 'Sarah Wilson', avatar: 'SW', text: 'Looking forward to seeing the designs!', time: '30 minutes ago' },
    ],
    history: [
      { action: 'Status changed', from: 'Pending', to: 'In Progress', user: 'Jane Smith', time: '3 hours ago' },
      { action: 'Assignee changed', from: 'Unassigned', to: 'Jane Smith', user: 'John Doe', time: '1 day ago' },
      { action: 'Priority changed', from: 'Medium', to: 'High', user: 'John Doe', time: '1 day ago' },
      { action: 'Task created', user: 'John Doe', time: '2 days ago' },
    ],
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/signin');
    }
  }, [router]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'inprogress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
        
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link href="/projects" className="hover:text-teal-600 transition-colors">Projects</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href={`/projects/${task.project.id}`} className="hover:text-teal-600 transition-colors">{task.project.name}</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Task Details</span>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{task.title}</h1>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(task.status)}`}>
                    {task.status === 'inprogress' ? 'In Progress' : task.status}
                  </span>
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority} priority
                  </span>
                  <Link
                    href={`/projects/${task.project.id}`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: task.project.color }}></div>
                    {task.project.name}
                  </Link>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all">
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{task.description}</p>
                </div>

                {/* Attachments */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Attachments</h2>
                    <button className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {task.attachments.map((attachment, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{attachment.size}</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-teal-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Comments</h2>
                  <div className="space-y-4 mb-6">
                    {task.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold shrink-0">
                          {comment.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-900">{comment.user}</span>
                              <span className="text-xs text-gray-500">{comment.time}</span>
                            </div>
                            <p className="text-gray-700">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="flex gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold shrink-0">
                      Y
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none resize-none"
                      ></textarea>
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-linear-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-medium hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/30"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Change History */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Change History</h2>
                  <div className="space-y-4">
                    {task.history.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 shrink-0"></div>
                        <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{item.user}</span>
                            {' '}{item.action.toLowerCase()}
                            {item.from && (
                              <>
                                {' '}from <span className="font-medium">{item.from}</span>
                                {' '}to <span className="font-medium">{item.to}</span>
                              </>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Task Details */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Assignee</label>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-linear-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {task.assignee.avatar}
                        </div>
                        <span className="text-gray-900 font-medium">{task.assignee.name}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Due Date</label>
                      <div className="flex items-center gap-2 text-gray-900">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Created By</label>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {task.creator.avatar}
                        </div>
                        <span className="text-gray-900 font-medium">{task.creator.name}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">Created</label>
                      <p className="text-gray-900">{new Date(task.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition-all flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mark as Complete
                    </button>
                    <button className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Move to Project
                    </button>
                    <button className="w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-xl font-medium hover:bg-purple-100 transition-all flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Duplicate Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
