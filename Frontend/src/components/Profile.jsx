import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { BACK_BUTTON } from "../assets/dummy.jsx"
import { ChevronLeft, Save, LogOut } from 'lucide-react'

const API_URL = 'https://taskpro-lh99.onrender.com'

const Profile = ({ setCurrentUser, onLogout }) => {
  const [profile, setProfile] = useState({ name: "", email: "" })
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch Profile Data on Mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    axios
      .get(`${API_URL}/api/user/me`, { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      .then(({ data }) => {
        if (data.success) {
          setProfile({ name: data.user.name, email: data.user.email })
        } else {
          toast.error(data.message)
        }
      })
      .catch(() => toast.error("UNABLE TO LOAD PROFILE."))
  }, [])

  // Async Function to Save Profile Data
  const saveProfile = async (e) => {
    e.preventDefault() 
    setIsLoading(true)

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error("Session expired. Please log in again.")
      setIsLoading(false)
      return
    }

    // Dynamic JavaScript check for optional password fields
    const isChangingPassword = passwords.current || passwords.new || passwords.confirm

    if (isChangingPassword) {
      if (!passwords.current || !passwords.new || !passwords.confirm) {
        toast.error("Please fill out all password fields.")
        setIsLoading(false)
        return
      }
      if (passwords.new !== passwords.confirm) {
        toast.error("New passwords do not match.")
        setIsLoading(false)
        return
      }
    }

    try {
      const payload = {
        name: profile.name,
        email: profile.email,
        ...(isChangingPassword && {
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      }

      const { data } = await axios.put(`${API_URL}/api/user/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        toast.success("Profile updated successfully!")
        
        if (data.token) {
          localStorage.setItem('token', data.token)
        }

        if (setCurrentUser) {
          setCurrentUser(data.user)
        }

        setPasswords({ current: "", new: "", confirm: "" })
      } else {
        toast.error(data.message || "Failed to update profile.")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while saving.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <ToastContainer position='top-center' autoClose={3000} />

      <div className='max-w-4xl mx-auto p-6'>
        <div className='flex justify-between items-center mb-6'>
          <button onClick={() => navigate(-1)} className={BACK_BUTTON}>
            <ChevronLeft className='w-5 h-5 mr-1' />
            Back to Dashboard
          </button>

          <button onClick={onLogout} className='flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium text-sm transition-colors'>
            <LogOut className='w-4 h-4' />
            Log Out
          </button>
        </div>

        <div className='flex items-center gap-4 mb-8'>
          <div className='w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md'>
            {profile.name ? profile.name[0].toUpperCase() : "U"}
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Account Settings</h1>
            <p className='text-gray-500 text-sm'>Manage Profile and security settings</p>
          </div>
        </div>

        <form onSubmit={saveProfile} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            
            {/* Profile Information Box */}
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4'>Profile Information</h2>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                  <input 
                    type='text' 
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
                  <input 
                    type='email' 
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Optional Password Changes Box */}
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4'>Change Password</h2>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Current Password</label>
                  <input 
                    type='password' 
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                    placeholder='Leave blank to keep current'
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>New Password</label>
                  <input 
                    type='password' 
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                    placeholder='Min. 8 characters'
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Confirm New Password</label>
                  <input 
                    type='password' 
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                    placeholder='Repeat new password'
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-end pt-2'>
            <button
              type='submit'
              disabled={isLoading}
              className='flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow transition-colors disabled:bg-purple-400'
            >
              <Save className='w-4 h-4' />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile