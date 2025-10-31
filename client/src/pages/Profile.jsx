import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { useMutation } from 'react-query'
import { authAPI } from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'
import { User, Mail, Shield, Key } from 'lucide-react'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm()

  const updateProfileMutation = useMutation(authAPI.updateProfile, {
    onSuccess: (response) => {
      updateUser(response.data.data)
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  })

  const changePasswordMutation = useMutation(authAPI.changePassword, {
    onSuccess: () => {
      resetPassword()
      toast.success('Password changed successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to change password')
    }
  })

  const onProfileSubmit = (data) => {
    updateProfileMutation.mutate(data)
  }

  const onPasswordSubmit = (data) => {
    changePasswordMutation.mutate(data)
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'password', name: 'Password', icon: Key }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className="form-label">Full Name</label>
                    <Input
                      {...registerProfile('name', { required: 'Name is required' })}
                      placeholder="Enter your full name"
                      error={profileErrors.name?.message}
                    />
                  </div>

                  <div>
                    <label className="form-label">Email Address</label>
                    <Input
                      type="email"
                      {...registerProfile('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      placeholder="Enter your email"
                      error={profileErrors.email?.message}
                    />
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-md">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Role</p>
                      <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      loading={updateProfileMutation.isLoading}
                    >
                      Update Profile
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="form-label">Current Password</label>
                    <Input
                      type="password"
                      {...registerPassword('currentPassword', { required: 'Current password is required' })}
                      placeholder="Enter current password"
                      error={passwordErrors.currentPassword?.message}
                    />
                  </div>

                  <div>
                    <label className="form-label">New Password</label>
                    <Input
                      type="password"
                      {...registerPassword('newPassword', { 
                        required: 'New password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      placeholder="Enter new password"
                      error={passwordErrors.newPassword?.message}
                    />
                  </div>

                  <div>
                    <label className="form-label">Confirm New Password</label>
                    <Input
                      type="password"
                      {...registerPassword('confirmPassword', { 
                        required: 'Please confirm your password',
                        validate: value => value === document.querySelector('input[name="newPassword"]').value || 'Passwords do not match'
                      })}
                      placeholder="Confirm new password"
                      error={passwordErrors.confirmPassword?.message}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      loading={changePasswordMutation.isLoading}
                    >
                      Change Password
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
