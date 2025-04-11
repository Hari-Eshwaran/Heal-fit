import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { mockUsers } from '../data/mockData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<User['profile']>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const user = mockUsers[email as keyof typeof mockUsers];
    
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    setState({
      user: userWithoutPassword as User,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const updateProfile = (profile: Partial<User['profile']>) => {
    if (!state.user) return;

    const updatedUser = {
      ...state.user,
      profile: {
        ...state.user.profile,
        ...profile
      }
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setState(prev => ({ ...prev, user: updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};