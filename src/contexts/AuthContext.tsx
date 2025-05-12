import React, { createContext, useState, useEffect, useContext } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'operator' | 'viewer';
  name: string;
  avatar?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    role: 'admin',
    name: 'Admin User',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    username: 'operator',
    role: 'operator',
    name: 'Drone Operator',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    username: 'viewer',
    role: 'viewer',
    name: 'Security Analyst',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('uavUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, simple auth check
    // In a real app, this would be a secure API call
    const user = mockUsers.find(u => u.username === username);
    
    if (user && password === 'password') { // Simple password for demo
      setCurrentUser(user);
      localStorage.setItem('uavUser', JSON.stringify(user));
      setLoading(false);
      return Promise.resolve();
    } else {
      setLoading(false);
      return Promise.reject(new Error('Invalid username or password'));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('uavUser');
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};