import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { HEADER, WRAPPER } from '../assets/dummy'
import { HomeIcon, Plus, RefreshCw, CheckCircle, Trash2, Circle, Clock, Check, AlertCircle, Calendar, Flag } from 'lucide-react'

const API_BASE = 'http://localhost:4000/api/task'

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  
  // 1. Updated Initial State to include initial status selection
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '',
    priority: 'Medium', 
    dueDate: '',
    status: 'in-progress' // 'in-progress' or 'completed'
  })

  // Fetch/Refresh Tasks from API
  const fetchTasks = async () => {
    setIsLoading(true)
    const token = localStorage.getItem('token')
    try {
      const { data } = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTasks(data.tasks || data)
    } catch (err) {
      console.error("Error fetching tasks:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // 2. Updated Task Handler to map 'status' selection to backend 'completed' boolean field
  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    const token = localStorage.getItem('token')
    try {
      const taskPayload = {
        title: newTask.title,
        description: newTask.description || "",
        priority: newTask.priority,
        dueDate: newTask.dueDate || null,
        completed: newTask.status === 'completed' // Maps perfectly to your backend filters
      }

      await axios.post(API_BASE, taskPayload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Reset form fields cleanly
      setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '', status: 'in-progress' })
      setShowModal(false)
      fetchTasks() 
    } catch (err) {
      console.error("Backend Error Response Data:", err.response?.data)
    }
  }

  // Toggle Complete Handler
  const handleToggleComplete = async (taskId, currentStatus) => {
    const token = localStorage.getItem('token')
    try {
      await axios.put(`${API_BASE}/${taskId}`, { completed: !currentStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTasks() 
    } catch (err) {
      console.error("Error updating task status:", err)
    }
  }

  // Delete Task Handler
  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token')
    try {
      await axios.delete(`${API_BASE}/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTasks() 
    } catch (err) {
      console.error("Error deleting task:", err)
    }
  }

  // Calculated Dashboard Metrics Statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = totalTasks - completedTasks
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Filter Logic matching filter state choices
  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed
    return true
  })

  // Small badge helper for display styling inside task items
  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100'
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-100'
      default: return 'bg-blue-50 text-blue-600 border-blue-100'
    }
  }

  return (
    <div className={WRAPPER}>
      
      {/* HEADER SECTION */}
      <div className={`${HEADER} flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-gray-100`}>
        <div className='min-w-0'>
          <h1 className='text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2'>
            <HomeIcon className='text-purple-500 w-5 h-5 md:w-6 md:h-6 shrink-0' />
            <span className='truncate'>Task Overview</span>
          </h1>
          <p className='text-sm text-gray-500 mt-1 truncate'>Manage your tasks efficiently</p>
        </div>

        <div className='flex items-center gap-2 self-start md:self-auto'>
          <button 
            onClick={fetchTasks}
            disabled={isLoading}
            className='p-2.5 text-gray-600 hover:text-purple-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm'
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-purple-600' : ''}`} />
          </button>
          
          <button
            onClick={() => setShowModal(true)}
            className='flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm transition'
          >
            <Plus className='w-4 h-4' />
            Add New Task
          </button>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
        <div className='bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3'>
          <div className='p-3 bg-blue-50 text-blue-600 rounded-lg'><Clock className='w-5 h-5' /></div>
          <div>
            <p className='text-xs font-medium text-gray-400 uppercase tracking-wider'>Total</p>
            <h3 className='text-2xl font-bold text-gray-800'>{totalTasks}</h3>
          </div>
        </div>
        <div className='bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3'>
          <div className='p-3 bg-green-50 text-green-600 rounded-lg'><CheckCircle className='w-5 h-5' /></div>
          <div>
            <p className='text-xs font-medium text-gray-400 uppercase tracking-wider'>Completed</p>
            <h3 className='text-2xl font-bold text-gray-800'>{completedTasks}</h3>
          </div>
        </div>
        <div className='bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3'>
          <div className='p-3 bg-amber-50 text-amber-600 rounded-lg'><AlertCircle className='w-5 h-5' /></div>
          <div>
            <p className='text-xs font-medium text-gray-400 uppercase tracking-wider'>Pending</p>
            <h3 className='text-2xl font-bold text-gray-800'>{pendingTasks}</h3>
          </div>
        </div>
        <div className='bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3'>
          <div className='p-3 bg-purple-50 text-purple-600 rounded-lg'><Check className='w-5 h-5' /></div>
          <div>
            <p className='text-xs font-medium text-gray-400 uppercase tracking-wider'>Progress</p>
            <h3 className='text-2xl font-bold text-gray-800'>{completionRate}%</h3>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className='flex gap-2 mt-8 mb-4 border-b border-gray-200 pb-2'>
        {['all', 'pending', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 capitalize font-medium text-sm transition-all border-b-2 -mb-[10px] ${
              filter === tab 
                ? 'border-purple-600 text-purple-600 font-semibold' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab} Tasks
          </button>
        ))}
      </div>

      {/* TASK LIST DISPLAY */}
      <div className='space-y-3 mt-4'>
        {filteredTasks.length === 0 ? (
          <div className='text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-400'>
            No tasks found matching this criteria.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div 
              key={task._id} 
              className={`flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm transition gap-4 ${
                task.completed ? 'border-gray-100 opacity-75' : 'border-purple-50 hover:border-purple-200'
              }`}
            >
              <div className='flex items-start gap-3 min-w-0 w-full'>
                <button 
                  onClick={() => handleToggleComplete(task._id, task.completed)}
                  className={`mt-0.5 shrink-0 transition-colors ${task.completed ? 'text-green-500' : 'text-gray-300 hover:text-purple-500'}`}
                >
                  {task.completed ? <CheckCircle className='w-5 h-5' /> : <Circle className='w-5 h-5' />}
                </button>
                <div className='min-w-0 flex-1'>
                  <h4 className={`font-semibold text-gray-800 break-all ${task.completed ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className={`text-sm text-gray-500 mt-0.5 break-all ${task.completed ? 'line-through text-gray-300' : ''}`}>
                      {task.description}
                    </p>
                  )}
                  
                  {/* Metadata display badges for UI lists */}
                  <div className='flex flex-wrap items-center gap-2 mt-2'>
                    {task.priority && (
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded border capitalize ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className='text-[11px] text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-100'>
                        <Calendar className='w-3 h-3' />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                </div>
              </div>
              <button 
                onClick={() => handleDeleteTask(task._id)}
                className='text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition shrink-0'
              >
                <Trash2 className='w-4 h-4' />
              </button>
            </div>
          ))
        )}
      </div>

      {/* CREATION MODAL OVERLAY */}
      {showModal && (
        <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm'>
          <div className='bg-white rounded-xl shadow-xl border max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150'>
            <h3 className='text-lg font-bold text-gray-800 mb-4'>Create New Task</h3>
            <form onSubmit={handleAddTask} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Task Title</label>
                <input 
                  type='text'
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                  placeholder='What needs to be done?'
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Description (Optional)</label>
                <textarea 
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                  placeholder='Add details...'
                  rows='2'
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1'>
                    <Flag className='w-3.5 h-3.5 text-purple-500' /> Priority
                  </label>
                  <select
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm'
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1'>
                    <Calendar className='w-3.5 h-3.5 text-purple-500' /> Due Date
                  </label>
                  <input 
                    type='date'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm'
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>

              {/* NEW ADDITION: Status Selection Radio Buttons */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Initial Task Status</label>
                <div className='grid grid-cols-2 gap-3'>
                  <label className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer text-sm font-medium transition ${
                    newTask.status === 'in-progress' 
                      ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>
                    <input 
                      type='radio'
                      name='taskStatus'
                      value='in-progress'
                      className='sr-only'
                      checked={newTask.status === 'in-progress'}
                      onChange={() => setNewTask({ ...newTask, status: 'in-progress' })}
                    />
                    <Circle className={`w-4 h-4 ${newTask.status === 'in-progress' ? 'text-purple-600' : 'text-gray-400'}`} />
                    In-Progress
                  </label>

                  <label className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer text-sm font-medium transition ${
                    newTask.status === 'completed' 
                      ? 'border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>
                    <input 
                      type='radio'
                      name='taskStatus'
                      value='completed'
                      className='sr-only'
                      checked={newTask.status === 'completed'}
                      onChange={() => setNewTask({ ...newTask, status: 'completed' })}
                    />
                    <CheckCircle className={`w-4 h-4 ${newTask.status === 'completed' ? 'text-green-600' : 'text-gray-400'}`} />
                    Completed
                  </label>
                </div>
              </div>

              <div className='flex justify-end gap-2 pt-2 border-t border-gray-100 mt-4'>
                <button 
                  type='button'
                  onClick={() => { setShowModal(false); setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '', status: 'in-progress' }); }}
                  className='px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium'
                >
                  Cancel
                </button>
                <button 
                  type='submit'
                  className='px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium shadow-sm'
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard;