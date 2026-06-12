import React, { useCallback, useEffect, useMemo, useState } from 'react';
import NavBar from './Navbar';
import SideBar from './Sidebar';
import axios from 'axios';
import { TrendingUp, Circle, Clock, CheckCircle, Calendar, MessageSquare } from 'lucide-react';
import Completed from '../pages/CompletePage.jsx';
import Pending from '../pages/PendingPage.jsx';
import Profile from '../components/Profile.jsx';
import Dashboard from '../pages/Dashboard.jsx'; // Cleaned duplicate lowercase import

const Layout = ({ onLogout, user, children }) => {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);


    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get(
        'http://localhost:4000/api/user/me',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data.tasks)
        ? data.tasks
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setTasks(arr);

    } catch (error) {
      console.error(error);
      setError(error.message || 'Could not load tasks');
      if (error.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(
      (t) =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === 'string' &&
          t.completed.toLowerCase() === 'yes')
    ).length;

    const totalCount = tasks.length;
    const pendingCount = totalCount - completedTasks;

    const completionPercentage = totalCount
      ? Math.round((completedTasks / totalCount) * 100)
      : 0;

      const handleToggleActivityComplete = async (taskId, currentStatus) => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    // Assuming your backend route for updating/toggling tasks is structured like this
    await axios.put(`http://localhost:4000/api/tasks/${taskId}`, { 
      completed: !currentStatus 
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // CRITICAL: This refreshes layout tasks so the stats and timeline update live!
    fetchTasks(); 
  } catch (err) {
    console.error("Error toggling task from timeline:", err);
  }
};

    return {
      totalCount,
      completedTasks,
      pendingCount,
      completionPercentage
    };
  }, [tasks]);

  // Extracting recent tasks for the Activity Feed logic
  const recentActivities = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id))
      .slice(0, 5); // Display top 5 most recent items
  }, [tasks]);

  const StatCard = ({ title, value, icon }) => (
    <div className="p-3 rounded-xl bg-white shadow-sm border border-purple-100 hover:shadow-md transition-all duration-300 hover:border-purple-300 group">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 group-hover:from-fuchsia-500/20 group-hover:to-purple-500/20">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
            {value}
          </p>
          <p className="text-sm text-gray-500 truncate">{title}</p>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-md w-full text-center">
        <p className="font-medium mb-2">Error loading tasks: {error}</p>
        <button onClick={fetchTasks} className="mt-2 py-2 px-4 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
          Try Again
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar user={user} onLogout={onLogout} />
      
      <SideBar
        user={user}
        tasks={tasks}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Responsive Grid Container */}
      <div className="pl-0 md:pl-16 lg:pl-64 p-4 lg:p-6 transition-all duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* LEFT SECTION (Main view container - takes 2/3 width on desktops) */}
          <div className="xl:col-span-2 space-y-6">
          

            <main className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm min-h-[500px]">
              {activeSection === "dashboard" && <Dashboard />}
              {activeSection === "completed" && <Completed />}
              {activeSection === "pending" && <Pending />}
              {activeSection === "profile" && <Profile user={user} onLogout={onLogout} />}
            </main>
          </div>

          {/* RIGHT SECTION: Recent Activity Card (Takes 1/3 width on desktops) */}
          <div className="xl:col-span-1">

            {/* Dynamic Task Statistics Card Panel */}
<div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-4">
  <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100">
    <div className="p-2 bg-fuchsia-50 rounded-lg text-fuchsia-600">
      <TrendingUp className="w-4 h-4" />
    </div>
    <div>
      <h3 className="font-bold text-gray-800 text-base">Metrics Progress</h3>
      <p className="text-xs text-gray-400">Live operational overview</p>
    </div>
  </div>

  {/* Compact Data Grid Display */}
  <div className="grid grid-cols-2 gap-3">
    
    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total</p>
      <p className="text-xl font-bold text-gray-800 mt-0.5">{stats.totalCount}</p>
    </div>

    <div className="p-3 rounded-lg bg-green-50/50 border border-green-100/60">
      <p className="text-xs font-medium text-green-600/80 uppercase tracking-wider">Done</p>
      <p className="text-xl font-bold text-green-700 mt-0.5">{stats.completedTasks}</p>
    </div>

    <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100/60">
      <p className="text-xs font-medium text-amber-600/80 uppercase tracking-wider">Pending</p>
      <p className="text-xl font-bold text-amber-700 mt-0.5">{stats.pendingCount}</p>
    </div>

    <div className="p-3 rounded-lg bg-purple-50/50 border border-purple-100/60">
      <p className="text-xs font-medium text-purple-600/80 uppercase tracking-wider">Progress</p>
      <p className="text-xl font-bold text-purple-700 mt-0.5">{stats.completionPercentage}%</p>
    </div>

  </div>

  {/* Visual Progress Utility Fill Bar */}
  <div className="mt-4">
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div 
        className="bg-gradient-to-r from-fuchsia-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${stats.completionPercentage}%` }}
      />
    </div>
  </div>
</div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">Recent Activity</h3>
                  <p className="text-xs text-gray-400">Latest updates from your log</p>
                </div>
              </div>

              {/* Feed Timeline Items */}
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivities.length === 0 ? (
                    <div className="text-center py-8 text-sm text-gray-400 flex flex-col items-center gap-2">
                      <MessageSquare className="w-8 h-8 opacity-40" />
                      No recent actions documented.
                    </div>
                  ) : (
                    recentActivities.map((activity, activityIdx) => (
                      <li key={activity._id}>
  <div className="relative pb-6">
    {/* Timeline connector thread graphic line */}
    {activityIdx !== recentActivities.length - 1 ? (
      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-100" aria-hidden="true" />
    ) : null}
    
    <div className="relative flex space-x-3">
      <div>
        {/* CHANGED: span converted to interactive button */}
        <button 
          onClick={() => handleToggleActivityComplete(activity._id, activity.completed)}
          title={activity.completed ? "Mark as pending" : "Mark as completed"}
          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white transition-all transform hover:scale-105 active:scale-95 ${
            activity.completed 
              ? 'bg-green-50 text-green-500 hover:bg-green-100' 
              : 'bg-purple-50 text-purple-500 hover:bg-purple-100 hover:text-purple-600'
          }`}
        >
          {activity.completed ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Circle className="w-4 h-4" />
          )}
        </button>
      </div>
      <div className="flex-1 min-w-0 pt-1.5">
        {/* Added dynamic line-through styling if task is finished */}
        <p className={`text-sm font-semibold text-gray-700 truncate ${activity.completed ? 'line-through text-gray-400' : ''}`}>
          {activity.title}
        </p>
        <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
          <span className="capitalize font-medium text-gray-500">
            {activity.completed ? 'Finished task' : 'Created pending task'}
          </span>
          <span>•</span>
          <span>
            {activity.createdAt 
              ? new Date(activity.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})
              : 'Just Now'}
          </span>
        </div>
      </div>
    </div>
  </div>
</li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Layout;
