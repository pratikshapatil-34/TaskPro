import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Trash2, RotateCcw, ShieldCheck } from 'lucide-react';

const API_BASE = 'https://taskpro-lh99.onrender.com/api/task';

const CompletePage = ({ fetchTasks }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCompletedTasks = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allTasks = data.tasks || data;
      // Filter out only completed tasks
      setTasks(allTasks.filter(task => task.completed));
    } catch (err) {
      console.error("Error fetching completed tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  // FIXED: Renamed to handleMarkAsPending and changed payload to completed: false
  const handleMarkAsPending = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_BASE}/${taskId}`, { completed: false }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // FIXED: Refresh our local completed list view cleanly
      fetchCompletedTasks(); 
      
      // Tell parent layout to reload live global metrics (Sidebar activity & stats card)
      if (fetchTasks) fetchTasks(); 
    } catch (err) {
      console.error("Error marking task as pending:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE}/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // FIXED: Refresh our local completed list view cleanly
      fetchCompletedTasks();
      
      // Tell parent layout to reload live global metrics
      if (fetchTasks) fetchTasks(); 
    } catch (err) {
      console.error("Error deleting task:", err);
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
        <div className="p-2 bg-green-50 rounded-lg text-green-600">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Completed Archive</h2>
          <p className="text-xs text-gray-400">Review all your finished tasks here</p>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 text-sm">
            You haven't completed any tasks yet. Keep up the momentum!
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm opacity-85">
              <div className="flex items-start gap-3 min-w-0">
                <button 
                  onClick={() => handleMarkAsPending(task._id)}
                  className="mt-0.5 shrink-0 text-green-500 hover:text-purple-500 transition-colors"
                  title="Mark as pending"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-500 line-through break-all">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-sm text-gray-300 line-through mt-0.5 break-all">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleMarkAsPending(task._id)}
                  className="text-gray-400 hover:text-purple-600 p-1.5 hover:bg-purple-50 rounded-lg transition"
                  title="Reopen task"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition"
                  title="Delete permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompletePage;