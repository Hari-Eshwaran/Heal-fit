import React, { useState } from 'react';
import { Users, Server, BarChart2, Shield, TrendingUp, Settings, Bell, MessageSquare, UserPlus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { systemData, healthMetrics, mockUsers } from '../data/mockData';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [contentFilter, setContentFilter] = useState('all');

  if (user?.role !== 'admin') {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <p className="text-red-600">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{systemData.users.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-indigo-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{systemData.users.active}</p>
                  </div>
                  <UserPlus className="w-8 h-8 text-green-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Last 30 days</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Demographics</p>
                    <p className="text-2xl font-bold text-gray-900">4 Groups</p>
                  </div>
                  <BarChart2 className="w-8 h-8 text-purple-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-purple-600">View details</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
              <div className="space-y-4">
                {Object.entries(systemData.users.demographics.age).map(([range, percentage]) => (
                  <div key={range}>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{range}</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">System Uptime</p>
                    <p className="text-2xl font-bold text-gray-900">{systemData.system.uptime}</p>
                  </div>
                  <Server className="w-8 h-8 text-green-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Last 30 days</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Critical Errors</p>
                    <p className="text-2xl font-bold text-gray-900">{systemData.system.errors.critical}</p>
                  </div>
                  <Bell className="w-8 h-8 text-red-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-red-600">Requires attention</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Last Deployment</p>
                    <p className="text-2xl font-bold text-gray-900">Success</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">{systemData.system.lastDeployment}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Logs</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">Warning: High CPU usage detected (85%)</p>
                  <p className="text-xs text-yellow-600 mt-1">2 hours ago</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">Database backup completed successfully</p>
                  <p className="text-xs text-green-600 mt-1">4 hours ago</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">System update installed: v2.1.0</p>
                  <p className="text-xs text-blue-600 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Usage</h3>
              <div className="space-y-4">
                {systemData.features.mostUsed.map(feature => (
                  <div key={feature.name}>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{feature.name}</span>
                      <span>{feature.usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${feature.usage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Health</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Health Tracking</p>
                      <p className="text-xs text-green-700">All systems operational</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-700">99.9% uptime</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Meal Planning</p>
                      <p className="text-xs text-green-700">All systems operational</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-700">99.8% uptime</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-yellow-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Exercise Logs</p>
                      <p className="text-xs text-yellow-700">Minor performance issues</p>
                    </div>
                  </div>
                  <span className="text-xs text-yellow-700">97.5% uptime</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Failed Logins</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-red-600">Last 24 hours</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-blue-600">Currently online</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Security Score</p>
                    <p className="text-2xl font-bold text-gray-900">92/100</p>
                  </div>
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-green-600">Good standing</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Login Activity</h3>
              <div className="space-y-4">
                {systemData.security.recentLogins.map((login, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{login.user}</p>
                      <p className="text-xs text-gray-500">{login.time}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        login.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {login.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Average Session</p>
                    <p className="text-2xl font-bold text-gray-900">24m</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-blue-600">+8% vs last week</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Goal Completion</p>
                    <p className="text-2xl font-bold text-gray-900">67%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-green-600">+12% vs last month</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">User Satisfaction</p>
                    <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                  </div>
                  <Users className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-yellow-600">Based on 234 reviews</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Improvement Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Weight Management Success</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Exercise Goal Achievement</span>
                    <span>64%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Mental Health Improvement</span>
                    <span>89%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'management':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </button>
              </div>
              <div className="space-y-4">
                {Object.values(mockUsers).map((mockUser) => (
                  <div key={mockUser.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
                      <p className="text-xs text-gray-500">{mockUser.email}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        mockUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {mockUser.role}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Content Management</h3>
                <div className="flex space-x-4">
                  <select
                    value={contentFilter}
                    onChange={(e) => setContentFilter(e.target.value)}
                    className="rounded-lg border-gray-300 text-sm"
                  >
                    <option value="all">All Content</option>
                    <option value="tips">Health Tips</option>
                    <option value="articles">Articles</option>
                    <option value="announcements">Announcements</option>
                  </select>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Add Content
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Health Tip</span>
                      <h4 className="text-lg font-medium mt-2">Stay Hydrated</h4>
                      <p className="text-gray-600 text-sm mt-1">Drink 8 glasses of water daily for optimal health.</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Article</span>
                      <h4 className="text-lg font-medium mt-2">Benefits of Morning Exercise</h4>
                      <p className="text-gray-600 text-sm mt-1">Start your day with energy and vitality...</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Announcement</span>
                      <h4 className="text-lg font-medium mt-2">New Feature: Group Challenges</h4>
                      <p className="text-gray-600 text-sm mt-1">Join health challenges with friends...</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm">
          <nav className="space-y-2">
            {[
              { id: 'overview', icon: Users, label: 'User Overview' },
              { id: 'system', icon: Server, label: 'System Health' },
              { id: 'features', icon: BarChart2, label: 'Feature Usage' },
              { id: 'security', icon: Shield, label: 'Security' },
              { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
              { id: 'management', icon: Settings, label: 'User Management' },
              { id: 'content', icon: MessageSquare, label: 'Content Control' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  selectedTab === item.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;