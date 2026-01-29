'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWidget from '../components/ChatWidget';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    loadTasks(token);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const loadTasks = async (token: string) => {
    try {
      const data = await api.getTasks(token);
      setTasks(data);
    } catch (error: any) {
      if (error.message.includes('Failed to fetch')) {
        localStorage.clear();
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await api.createTask(token, newTask);
      setNewTask({ title: '', description: '' });
      setShowAddModal(false);
      loadTasks(token);
    } catch (error: any) {
      alert('Failed to create task: ' + error.message);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await api.updateTask(token, task.id, { completed: !task.completed });
      loadTasks(token);
    } catch (error) {
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await api.deleteTask(token, id);
      loadTasks(token);
    } catch (error) {
      alert('Failed to delete task');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'completed' ? task.completed :
      !task.completed;
    
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-center"
        >
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className={`w-16 h-16 border-4 border-t-transparent rounded-full mx-auto mb-4 ${darkMode ? 'border-emerald-400' : 'border-emerald-600'}`}
          />
          <p className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading your workspace...</p>
        </motion.div>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode 
        ? 'bg-gray-950' 
        : 'bg-gray-50'
    }`}>
      
      {/* Top Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 backdrop-blur-lg border-b ${
          darkMode 
            ? 'bg-gray-900/90 border-gray-800' 
            : 'bg-white/90 border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-4">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-11 h-11 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>TaskMaster</h1>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Productivity Suite</p>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className={`hidden md:flex items-center space-x-1 p-1 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? darkMode ? 'bg-gray-700 text-emerald-400' : 'bg-white text-emerald-600 shadow-sm'
                      : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? darkMode ? 'bg-gray-700 text-emerald-400' : 'bg-white text-emerald-600 shadow-sm'
                      : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </motion.button>
              </div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-xl transition-all ${
                  darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </motion.button>

              {/* User Menu */}
              {user && (
                <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all ${
                      darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className={`hidden md:block font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.username}
                    </span>
                  </motion.button>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all ${
                      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <button
                      onClick={handleLogout}
                      className={`w-full px-4 py-3 text-left flex items-center space-x-2 transition-colors ${
                        darkMode ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-600'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">Logout</span>
                    </button>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Stats Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div 
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden rounded-2xl p-6 ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Tasks</p>
              <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tasks.length}</p>
              <div className="mt-3">
                <span className="inline-flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  All items
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden rounded-2xl p-6 ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-transparent rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>In Progress</p>
              <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pendingCount}</p>
              <div className="mt-3">
                <span className="inline-flex items-center text-xs font-medium text-orange-600 dark:text-orange-400">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Pending
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden rounded-2xl p-6 ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-transparent rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
              <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{completedCount}</p>
              <div className="mt-3">
                <span className="inline-flex items-center text-xs font-medium text-green-600 dark:text-green-400">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Done
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden rounded-2xl p-6 ${
              darkMode ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-gradient-to-br from-emerald-500 to-teal-600'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <p className="text-sm font-medium mb-1 text-emerald-100">Completion Rate</p>
              <p className="text-3xl font-bold text-white">{completionRate}%</p>
              <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Controls Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 mb-6 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all ${
                  darkMode 
                    ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-emerald-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                }`}
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              {(['all', 'pending', 'completed'] as const).map((f) => (
                <motion.button
                  key={f}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-3 rounded-xl font-medium text-sm transition-all ${
                    filter === f
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' && '📋 All'}
                  {f === 'pending' && '⏳ Pending'}
                  {f === 'completed' && '✅ Done'}
                </motion.button>
              ))}
            </div>

            {/* Add Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Task</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Tasks Display */}
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-2xl p-16 text-center ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center">
                <span className="text-5xl">📝</span>
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {searchQuery ? 'No matching tasks' : 'No tasks yet'}
              </h3>
              <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchQuery ? 'Try a different search term' : 'Start organizing your day by creating your first task'}
              </p>
              {!searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg"
                >
                  Create Your First Task
                </motion.button>
              )}
            </motion.div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -6 }}
                  className={`group rounded-2xl p-6 border transition-all ${
                    task.completed
                      ? darkMode
                        ? 'bg-gray-800/50 border-gray-700 hover:border-emerald-500/50'
                        : 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                      : darkMode
                        ? 'bg-gray-800 border-gray-700 hover:border-emerald-500'
                        : 'bg-white border-gray-200 hover:border-emerald-300 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleComplete(task)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-emerald-500 border-emerald-500'
                          : darkMode
                            ? 'border-gray-600 hover:border-emerald-500'
                            : 'border-gray-300 hover:border-emerald-500'
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteTask(task.id)}
                      className={`opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all ${
                        darkMode ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </div>

                  <h3 className={`text-lg font-semibold mb-2 ${
                    task.completed
                      ? darkMode ? 'text-gray-500 line-through' : 'text-gray-400 line-through'
                      : darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {task.title}
                  </h3>
                  
                  {task.description && (
                    <p className={`text-sm mb-4 line-clamp-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className={`text-xs flex items-center ${
                      darkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ x: 4 }}
                  className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    task.completed
                      ? darkMode
                        ? 'bg-gray-800/50 border-gray-700 hover:border-emerald-500/50'
                        : 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                      : darkMode
                        ? 'bg-gray-800 border-gray-700 hover:border-emerald-500'
                        : 'bg-white border-gray-200 hover:border-emerald-300 shadow-sm hover:shadow-md'
                  }`}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleToggleComplete(task)}
                    className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500'
                        : darkMode
                          ? 'border-gray-600 hover:border-emerald-500'
                          : 'border-gray-300 hover:border-emerald-500'
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </motion.button>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold mb-1 ${
                      task.completed
                        ? darkMode ? 'text-gray-500 line-through' : 'text-gray-400 line-through'
                        : darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`text-sm line-clamp-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteTask(task.id)}
                      className={`opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all ${
                        darkMode ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-16 pt-8 border-t text-center ${
            darkMode ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-600'
          }`}
        >
          <p className="text-sm">
            Built with 💚 by <span className="font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Shahmir Atiq</span>
          </p>
          <p className="text-xs mt-2">© 2026 TaskMaster. All rights reserved.</p>
        </motion.footer>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-3xl p-8 max-w-lg w-full shadow-2xl ${
                darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Create New Task
                  </h2>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Add a new item to your workflow
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddModal(false)}
                  className={`p-2 rounded-xl transition-all ${
                    darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-5">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-emerald-500'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
                    }`}
                    placeholder="What needs to be done?"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description (Optional)
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-emerald-500'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
                    }`}
                    rows={4}
                    placeholder="Add more details about this task..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddModal(false)}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                      darkMode
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Create Task
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}