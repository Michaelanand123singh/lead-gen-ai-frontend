// frontend/src/pages/SettingsPage.js
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { apiClient } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    apiUrl: import.meta.env.VITE_API_URL || 'https://lead-gen-ai-backend-595294038624.asia-south2.run.app/api/v1',
    autoRefresh: true,
    refreshInterval: 5000,
    maxFileSize: 10,
    notifications: true,
    darkMode: false,
    exportFormat: 'xlsx'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile state
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [createUserForm, setCreateUserForm] = useState({ name: '', email: '', password: '' });
  const [userOpsLoading, setUserOpsLoading] = useState(false);
  const [userOpsError, setUserOpsError] = useState('');
  const [userOpsSuccess, setUserOpsSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      try {
        setSettings({ ...settings, ...JSON.parse(savedSettings) });
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    }
  }, []);

  useEffect(() => {
    // Load current user profile
    const loadProfile = async () => {
      setProfileLoading(true);
      setProfileError('');
      try {
        const me = await apiClient.getMe();
        setProfile({ name: me.name || '', email: me.email || '' });
        const adminEmail = 'theanandsingh76@gmail.com';
        setIsAdmin((me.email || '').toLowerCase() === adminEmail);
      } catch (err) {
        setProfileError(err.message || 'Failed to load profile');
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      if (!isAdmin) return;
      setUserOpsLoading(true);
      setUserOpsError('');
      try {
        const [list, count] = await Promise.all([
          apiClient.listUsers(),
          apiClient.countUsers(),
        ]);
        setUsers(list);
        setUserCount(count.count || list.length);
      } catch (err) {
        setUserOpsError(err.message || 'Failed to load users');
      } finally {
        setUserOpsLoading(false);
      }
    };
    loadUsers();
  }, [isAdmin]);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate settings
      if (settings.refreshInterval < 1000) {
        throw new Error('Refresh interval must be at least 1 second');
      }
      if (settings.maxFileSize < 1 || settings.maxFileSize > 100) {
        throw new Error('File size must be between 1MB and 100MB');
      }

      // Save to localStorage
      localStorage.setItem('app_settings', JSON.stringify(settings));
      setSuccess('Settings saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      apiUrl: 'http://localhost:8000/api/v1',
      autoRefresh: true,
      refreshInterval: 5000,
      maxFileSize: 10,
      notifications: true,
      darkMode: false,
      exportFormat: 'xlsx'
    };
    setSettings(defaultSettings);
    localStorage.removeItem('app_settings');
    setSuccess('Settings reset to defaults');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileSave = async () => {
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      if (passwords.new_password || passwords.confirm_password || passwords.current_password) {
        if (!passwords.current_password) throw new Error('Enter current password to change password');
        if (passwords.new_password !== passwords.confirm_password) throw new Error('New passwords do not match');
      }

      const payload = {
        name: profile.name,
        current_password: passwords.current_password || undefined,
        new_password: passwords.new_password || undefined,
      };
      await apiClient.updateMe(payload);
      setProfileSuccess('Profile updated');
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    try { localStorage.removeItem('auth'); } catch {}
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your application preferences</p>
        </div>

        {/* Messages */}
        {error && <ErrorMessage message={error} className="mb-6" />}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="ml-3 text-sm text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Profile Messages */}
        {profileError && <ErrorMessage message={profileError} className="mb-6" />}
        {profileSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="ml-3 text-sm text-green-800">{profileSuccess}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Profile</h2>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current password</label>
                  <input
                    type="password"
                    value={passwords.current_password}
                    onChange={(e) => setPasswords(p => ({ ...p, current_password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
                  <input
                    type="password"
                    value={passwords.new_password}
                    onChange={(e) => setPasswords(p => ({ ...p, new_password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm new password</label>
                  <input
                    type="password"
                    value={passwords.confirm_password}
                    onChange={(e) => setPasswords(p => ({ ...p, confirm_password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleProfileSave}
                  disabled={profileLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {profileLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* API Settings - Admin Only */}
          {isAdmin && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">API Configuration</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Base URL
                  </label>
                  <input
                    type="url"
                    value={settings.apiUrl}
                    onChange={(e) => handleInputChange('apiUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="http://localhost:8000/api/v1"
                  />
                  <p className="mt-1 text-xs text-gray-500">Base URL for the backend API</p>
                </div>
              </div>
            </div>
          )}

          {/* User Management - Admin Only */}
          {isAdmin && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">User Management</h2>
                <div className="text-sm text-gray-600">Total users: <span className="font-semibold">{userCount}</span></div>
              </div>
              <div className="p-6 space-y-6">
                {userOpsError && (
                  <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{userOpsError}</div>
                )}
                {userOpsSuccess && (
                  <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3">{userOpsSuccess}</div>
                )}

                {/* Create user form */}
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <h3 className="font-medium mb-3">Create New User</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={createUserForm.name}
                      onChange={(e)=>setCreateUserForm(f=>({...f, name: e.target.value}))}
                      className="px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={createUserForm.email}
                      onChange={(e)=>setCreateUserForm(f=>({...f, email: e.target.value}))}
                      className="px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                      type="password"
                      placeholder="Temporary password"
                      value={createUserForm.password}
                      onChange={(e)=>setCreateUserForm(f=>({...f, password: e.target.value}))}
                      className="px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={async ()=>{
                        try{
                          setUserOpsLoading(true); setUserOpsError(''); setUserOpsSuccess('');
                          if(!createUserForm.name || !createUserForm.email || !createUserForm.password){ throw new Error('All fields are required'); }
                          await apiClient.createUser(createUserForm);
                          setCreateUserForm({name:'',email:'',password:''});
                          const [list, count] = await Promise.all([apiClient.listUsers(), apiClient.countUsers()]);
                          setUsers(list); setUserCount(count.count || list.length);
                          setUserOpsSuccess('User created'); setTimeout(()=>setUserOpsSuccess(''), 3000);
                        }catch(err){ setUserOpsError(err.message||'Failed to create user'); }
                        finally{ setUserOpsLoading(false); }
                      }}
                      disabled={userOpsLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >{userOpsLoading? 'Working...' : 'Create User'}</button>
                  </div>
                </div>

                {/* Users table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last login</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last seen</th>
                        <th className="px-4 py-2"/>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(u => (
                        <tr key={u.id}>
                          <td className="px-4 py-2 whitespace-nowrap">{u.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap font-mono text-sm">{u.email}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs ${u.is_active? 'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'}`}>{u.is_active? 'Active':'Inactive'}</span>
                              {(() => {
                                const fiveMin = 5 * 60 * 1000;
                                const online = !!u.last_seen_at && (Date.now() - new Date(u.last_seen_at).getTime()) < fiveMin;
                                return online ? <span className="inline-flex items-center gap-1 text-xs text-green-700"><span className="w-2 h-2 bg-green-500 rounded-full"/>Online</span> : null;
                              })()}
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{u.last_login? new Date(u.last_login).toLocaleString(): '-'}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{u.last_seen_at? new Date(u.last_seen_at).toLocaleString(): '-'}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-right">
                            <button
                              onClick={async ()=>{
                                try{ setUserOpsLoading(true); setUserOpsError(''); setUserOpsSuccess('');
                                  await apiClient.forceLogoutUser(u.id);
                                  setUserOpsSuccess('User sessions invalidated'); setTimeout(()=>setUserOpsSuccess(''), 3000);
                                }catch(err){ setUserOpsError(err.message||'Failed to logout user'); }
                                finally{ setUserOpsLoading(false); }
                              }}
                              className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200"
                            >Logout</button>
                          </td>
                        </tr>
                      ))}
                      {!users.length && (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-sm text-gray-500">No users found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* General Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Auto Refresh</label>
                  <p className="text-xs text-gray-500">Automatically refresh analysis status</p>
                </div>
                <button
                  onClick={() => handleInputChange('autoRefresh', !settings.autoRefresh)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.autoRefresh ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.autoRefresh ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refresh Interval (milliseconds)
                </label>
                <input
                  type="number"
                  min="1000"
                  max="60000"
                  step="1000"
                  value={settings.refreshInterval}
                  onChange={(e) => handleInputChange('refreshInterval', parseInt(e.target.value))}
                  disabled={!settings.autoRefresh}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">How often to check for updates (1-60 seconds)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum File Size (MB)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.maxFileSize}
                  onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Maximum size for uploaded files</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Export Format
                </label>
                <select
                  value={settings.exportFormat}
                  onChange={(e) => handleInputChange('exportFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel (XLSX)</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>
          </div>

          {/* User Interface */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">User Interface</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Notifications</label>
                  <p className="text-xs text-gray-500">Show browser notifications for completed analyses</p>
                </div>
                <button
                  onClick={() => handleInputChange('notifications', !settings.notifications)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.notifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.notifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Dark Mode</label>
                  <p className="text-xs text-gray-500">Use dark theme (coming soon)</p>
                </div>
                <button
                  onClick={() => handleInputChange('darkMode', !settings.darkMode)}
                  disabled
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-200 opacity-50`}
                >
                  <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0" />
                </button>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">System Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Version:</span>
                  <span className="ml-2 text-gray-600">1.0.0</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Environment:</span>
                  <span className="ml-2 text-gray-600">{import.meta.env.MODE || 'development'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Build Date:</span>
                  <span className="ml-2 text-gray-600">{new Date().toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Browser:</span>
                  <span className="ml-2 text-gray-600">{navigator.userAgent.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" text="" />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;