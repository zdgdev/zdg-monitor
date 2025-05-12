import React, { useState } from 'react';
import { Users, UserPlus, Edit2, Trash2, Search } from 'lucide-react';
import Layout from '../components/layout/Layout';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  status: 'active' | 'inactive';
  lastLogin: Date;
}

const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    name: 'System Administrator',
    email: 'admin@uav-system.com',
    role: 'admin',
    status: 'active',
    lastLogin: new Date()
  },
  {
    id: '2',
    username: 'operator1',
    name: 'John Operator',
    email: 'john@uav-system.com',
    role: 'operator',
    status: 'active',
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    username: 'viewer1',
    name: 'Sarah Viewer',
    email: 'sarah@uav-system.com',
    role: 'viewer',
    status: 'inactive',
    lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
];

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    email: '',
    role: 'viewer' as 'admin' | 'operator' | 'viewer',
    password: '',
    confirmPassword: ''
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      lastLogin: new Date()
    };

    setUsers([...users, user]);
    setShowAddModal(false);
    setNewUser({
      username: '',
      name: '',
      email: '',
      role: 'viewer',
      password: '',
      confirmPassword: ''
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Users className="mr-2" />
            User Management
          </h1>
          <p className="text-[var(--color-text-secondary)]">Manage system users and their permissions</p>
        </div>

        <div className="panel">
          <div className="panel-header flex justify-between items-center">
            <div className="flex items-center bg-[var(--color-bg-tertiary)] rounded-md px-3 py-1">
              <Search size={16} className="text-[var(--color-text-secondary)]" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm ml-2 w-64"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-3 py-1 bg-[var(--color-accent-blue)] text-white rounded-md hover:bg-[var(--color-accent-blue)]/80"
            >
              <UserPlus size={16} className="mr-1" />
              Add User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--color-bg-tertiary)]">
                <tr>
                  <th className="px-4 py-2 text-left text-sm">Username</th>
                  <th className="px-4 py-2 text-left text-sm">Name</th>
                  <th className="px-4 py-2 text-left text-sm">Email</th>
                  <th className="px-4 py-2 text-left text-sm">Role</th>
                  <th className="px-4 py-2 text-left text-sm">Status</th>
                  <th className="px-4 py-2 text-left text-sm">Last Login</th>
                  <th className="px-4 py-2 text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-[var(--color-bg-tertiary)]">
                    <td className="px-4 py-3 text-sm">{user.username}</td>
                    <td className="px-4 py-3 text-sm">{user.name}</td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-[var(--color-accent-blue)]/20 text-[var(--color-accent-blue)]' :
                        user.role === 'operator' ? 'bg-[var(--color-accent-green)]/20 text-[var(--color-accent-green)]' :
                        'bg-[var(--color-text-secondary)]/20 text-[var(--color-text-secondary)]'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'active' ? 'bg-[var(--color-accent-green)]/20 text-[var(--color-accent-green)]' :
                        'bg-[var(--color-accent-red)]/20 text-[var(--color-accent-red)]'
                      }`}>
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{user.lastLogin.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-[var(--color-bg-tertiary)] rounded">
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 hover:bg-[var(--color-bg-tertiary)] rounded text-[var(--color-accent-red)]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New User</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)]
                    rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)]
                    rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)]
                    rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as 'admin' | 'operator' | 'viewer'})}
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)]
                    rounded px-3 py-2"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="operator">Operator</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)]
                    rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)]
                    rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-md border border-[var(--color-bg-tertiary)]
                  hover:bg-[var(--color-bg-tertiary)]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 rounded-md bg-[var(--color-accent-blue)] text-white
                  hover:bg-[var(--color-accent-blue)]/80"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserManagementPage;