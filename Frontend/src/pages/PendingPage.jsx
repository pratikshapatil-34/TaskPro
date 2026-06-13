import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Circle, Trash2, Calendar, AlertCircle } from 'lucide-react';

const API_BASE = 'https://taskpro-lh99.onrender.com/api/task';

const PendingPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPendingTasks = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allTasks = data.tasks || data;
      // Filter out only uncompleted tasks
      setTasks(allTasks.filter(task => !task.completed));
    } catch (err) {
      console.error("Error fetching pending tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTasks();
  }, []);

  const handleMarkAsComplete = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_BASE}/${taskId}`, { completed: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPendingTasks(); // Instantly filter out completed task
    } catch (err) {
      console.error("Error completing task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE}/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPendingTasks(); // Update list array layout
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100';
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Pending Tasks</h2>
          <p className="text-xs text-gray-400">Items that require immediate action</p>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 text-sm">
            Inbox clear! You have no pending assignments right now.
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="flex items-center justify-between p-4 bg-white border border-purple-50/60 rounded-xl shadow-sm hover:border-purple-200 transition">
              <div className="flex items-start gap-3 min-w-0">
                <button 
                  onClick={() => handleMarkAsComplete(task._id)}
                  className="mt-0.5 shrink-0 text-gray-300 hover:text-green-500 transition-colors"
                  title="Mark as complete"
                >
                  <Circle className="w-5 h-5" />
                </button>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-800 break-all">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-0.5 break-all">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {task.priority && (
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded border capitalize ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleDeleteTask(task._id)}
                className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition shrink-0"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingPage;