import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Bell, AlertTriangle, Shield, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock notifications for demo
  const notifications = [
    { id: 1, type: 'alert', message: 'Drone-01 entered restricted area', time: '2 minutes ago' },
    { id: 2, type: 'warning', message: 'Drone-02 battery at 15%', time: '5 minutes ago' },
    { id: 3, type: 'info', message: 'System update available', time: '1 hour ago' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] grid-pattern">
      {/* Header */}
      <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-bg-tertiary)] p-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-[var(--color-bg-tertiary)] mr-3"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-bold glowing-text text-[var(--color-accent-blue)]">
            UAV DRONE MONITORING
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-md hover:bg-[var(--color-bg-tertiary)] relative"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[var(--color-accent-red)] animate-pulse"></span>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-md shadow-lg p-2 z-50">
                <h3 className="text-sm font-semibold p-2 border-b border-[var(--color-bg-tertiary)]">Notifications</h3>
                <ul className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <li key={notification.id} className="p-2 border-b border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-tertiary)] cursor-pointer">
                      <div className="flex items-start">
                        <div className="mr-2 mt-0.5">
                          {notification.type === 'alert' && <AlertTriangle size={16} className="text-[var(--color-accent-red)]" />}
                          {notification.type === 'warning' && <AlertTriangle size={16} className="text-[var(--color-accent-yellow)]" />}
                          {notification.type === 'info' && <Bell size={16} className="text-[var(--color-accent-blue)]" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{notification.message}</p>
                          <p className="text-xs text-[var(--color-text-secondary)]">{notification.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
              <img 
                src={currentUser?.avatar || "https://i.pravatar.cc/150?img=1"} 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium">{currentUser?.name || 'User'}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`bg-[var(--color-bg-secondary)] border-r border-[var(--color-bg-tertiary)] w-64 flex-shrink-0 transition-all duration-300 overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static h-[calc(100vh-56px)] z-20`}>
          <div className="p-4">
            <div className="bg-[var(--color-bg-tertiary)] rounded-md p-3 mb-4">
              <p className="text-xs text-[var(--color-text-secondary)]">Logged in as</p>
              <p className="font-medium">{currentUser?.name}</p>
              <p className="text-xs text-[var(--color-accent-blue)]">{currentUser?.role.toUpperCase()}</p>
            </div>
            
            <nav>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="flex items-center p-2 rounded-md text-[var(--color-accent-blue)] bg-[var(--color-bg-tertiary)]">
                    <Shield size={18} className="mr-2" />
                    <span>Dashboard</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-2 rounded-md hover:bg-[var(--color-bg-tertiary)]">
                    <User size={18} className="mr-2" />
                    <span>User Management</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-2 rounded-md hover:bg-[var(--color-bg-tertiary)]">
                    <Settings size={18} className="mr-2" />
                    <span>Settings</span>
                  </a>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center p-2 rounded-md hover:bg-[var(--color-bg-tertiary)] text-[var(--color-accent-red)]"
                  >
                    <LogOut size={18} className="mr-2" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;