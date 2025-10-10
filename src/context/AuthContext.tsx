import React, { createContext, useState, useContext, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
  schoolLevel: 'primary' | 'secondary' | 'university' | null;
  isSubscribed: boolean;
  subscriptionExpiry: string | null;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, schoolLevel: string) => Promise<void>;
  logout: () => void;
  updateSchoolLevel: (level: 'primary' | 'secondary' | 'university') => void;
  completeSubscription: () => void;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in a real app, this would come from your backend
      const mockUser: User = {
        id: '1',
        email,
        schoolLevel: 'secondary',
        isSubscribed: true,
        subscriptionExpiry: '2024-12-31',
        isAdmin: email === 'admin@aga.tz',
      };
      
      setUser(mockUser);
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, schoolLevel: string) => {
    setLoading(true);
    setError(null);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user registration
      const newUser: User = {
        id: Date.now().toString(),
        email,
        schoolLevel: schoolLevel as 'primary' | 'secondary' | 'university',
        isSubscribed: false,
        subscriptionExpiry: null,
        isAdmin: false,
      };
      
      setUser(newUser);
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateSchoolLevel = (level: 'primary' | 'secondary' | 'university') => {
    if (user) {
      setUser({ ...user, schoolLevel: level });
    }
  };

  const completeSubscription = () => {
    if (user) {
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      
      setUser({
        ...user,
        isSubscribed: true,
        subscriptionExpiry: oneYearFromNow.toISOString().split('T')[0],
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateSchoolLevel,
        completeSubscription,
        loading,
        error,
      }}>
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
