import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Download } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface Entry {
  _id: string;
  user?: string | { _id: string; username: string; email: string; role: string };
  mood: string;
  note: string;
  date: string;
  intensity: number;
  timestamp: number;
  tags: string[];
}

const AdminPanel: React.FC = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [allEntries, setAllEntries] = useState<Entry[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userFilter, setUserFilter] = useState<string>('all');

  const API_BASE_URL = 'http://localhost:4000/api';

  useEffect(() => {
    fetchUsers();
    fetchAllEntries();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      setError('Error fetching users');
    }
  };

  const fetchAllEntries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/entries`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllEntries(data);
      } else {
        setError('Failed to fetch entries');
      }
    } catch (error) {
      setError('Error fetching entries');
    } finally {
      setIsLoading(false);
    }
  };

  const changeUserPassword = async () => {
    if (!selectedUser || !newPassword) {
      alert('Please select a user and enter a new password');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/${selectedUser}/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        alert('Password changed successfully');
        setNewPassword('');
        setSelectedUser('');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to change password');
      }
    } catch (error) {
      alert('Error changing password');
    }
  };

  const getUserEntries = (userId: string) => {
    return allEntries.filter(entry => {
      if (!entry.user) return false;
      const entryUserId = typeof entry.user === 'string' ? entry.user : entry.user._id;
      return entryUserId === userId;
    });
  };

  // Get filtered entries based on user filter
  const getFilteredEntries = () => {
    if (userFilter === 'all') {
      return allEntries;
    }
    return allEntries.filter(entry => {
      if (!entry.user) return false;
      const entryUserId = typeof entry.user === 'string' ? entry.user : entry.user._id;
      return entryUserId === userFilter;
    });
  };

  const filteredEntries = getFilteredEntries();

  // Enhanced export function for admin
  const exportAllData = useCallback(() => {
    // Group entries by user
    const entriesByUser = allEntries.reduce((acc, entry) => {
      if (!entry.user) return acc; // Skip entries without user data
      
      const entryUserId = typeof entry.user === 'string' ? entry.user : entry.user._id;
      const user = users.find(u => u._id === entryUserId);
      const userId = entryUserId;
      const username = user?.username || 'Unknown User';
      
      if (!acc[userId]) {
        acc[userId] = {
          user: {
            _id: userId,
            username: username,
            email: user?.email || 'unknown@email.com',
            role: user?.role || 'user',
            createdAt: user?.createdAt || new Date().toISOString()
          },
          entries: []
        };
      }
      
      acc[userId].entries.push({
        _id: entry._id,
        date: entry.date,
        mood: entry.mood,
        note: entry.note,
        timestamp: entry.timestamp,
        intensity: entry.intensity,
        tags: entry.tags || []
      });
      
      return acc;
    }, {} as Record<string, { user: any; entries: any[] }>);

    const data = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        exportedBy: user ? `${user.username} (${user.email}) - Admin` : 'Unknown Admin',
        totalEntries: allEntries.length,
        totalUsers: users.length,
        version: '1.0.0',
        exportType: 'admin-full-export'
      },
      users: Object.values(entriesByUser),
      summary: {
        totalEntries: allEntries.length,
        totalUsers: users.length,
        dateRange: allEntries.length > 0 ? {
          earliest: Math.min(...allEntries.map(e => e.timestamp)),
          latest: Math.max(...allEntries.map(e => e.timestamp))
        } : null,
        moodDistribution: allEntries.reduce((acc, entry) => {
          acc[entry.mood] = (acc[entry.mood] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        userStats: users.map(user => ({
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          entryCount: getUserEntries(user._id).length,
          createdAt: user.createdAt
        }))
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-tracker-admin-export-${formatDate(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [allEntries, users, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-gray-600">Manage users and view all mood entries</p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Management */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username} ({user.email}) - {user.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter new password"
              />
            </div>

            <button
              onClick={changeUserPassword}
              disabled={!selectedUser || !newPassword}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change Password
            </button>
          </div>

          {/* User Statistics */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user._id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{user.username}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">Role: {user.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {getUserEntries(user._id).length} entries
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Data Export</h2>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-blue-900">Export All Data</p>
              <p className="text-sm text-blue-700">
                Download all users' mood entries with user information
              </p>
            </div>
            <button
              onClick={exportAllData}
              disabled={allEntries.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Download size={16} />
              <span>Export All Data</span>
            </button>
          </div>
        </div>

        {/* All Entries */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">All Mood Entries</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Filter by user:</label>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Users</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username} ({getUserEntries(user._id).length} entries)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredEntries.length} entries from {userFilter === 'all' ? users.length : 1} users
            </p>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mood
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Intensity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntries.map((entry) => {
                  if (!entry.user) return null; // Skip entries without user data
                  
                  const entryUserId = typeof entry.user === 'string' ? entry.user : entry.user._id;
                  const user = users.find(u => u._id === entryUserId);
                  const entryDate = new Date(entry.timestamp);
                  return (
                    <tr key={entry._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-indigo-800">
                                {user?.username?.charAt(0).toUpperCase() || '?'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user?.username || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user?.email || 'No email'}
                            </div>
                            <div className="text-xs text-gray-400">
                              Role: {user?.role || 'Unknown'} • ID: {typeof entry.user === 'string' ? entry.user.substring(0, 8) : (entry.user as any)?._id?.substring(0, 8) || 'Unknown'}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{entry.date}</div>
                        <div className="text-sm text-gray-500">
                          {entryDate.toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          entry.mood === 'happy' ? 'bg-green-100 text-green-800' :
                          entry.mood === 'sad' ? 'bg-blue-100 text-blue-800' :
                          entry.mood === 'anxious' ? 'bg-yellow-100 text-yellow-800' :
                          entry.mood === 'excited' ? 'bg-purple-100 text-purple-800' :
                          entry.mood === 'calm' ? 'bg-teal-100 text-teal-800' :
                          entry.mood === 'angry' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.mood}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={entry.note}>
                          {entry.note}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.intensity ? (
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-indigo-600 h-2 rounded-full" 
                                style={{ width: `${(entry.intensity / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{entry.intensity}/10</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.tags && entry.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.slice(0, 3).map((tag, index) => (
                              <span 
                                key={index}
                                className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {entry.tags.length > 3 && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                +{entry.tags.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No tags</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 