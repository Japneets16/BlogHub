import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getAuthToken, setAuthToken, removeAuthToken } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing token on mount
  useEffect(() => {
    const validateToken = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.user);
        } catch (error) {
          // Token is invalid, remove it
          removeAuthToken();
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });
      
      if (response.token && response.user) {
        setAuthToken(response.token);
        setUser(response.user);
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authAPI.signup(userData);
      
      if (response.token && response.user) {
        setAuthToken(response.token);
        setUser(response.user);
        toast({
          title: "Account Created!",
          description: "Welcome to our blogging platform.",
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      toast({
        title: "Signup Failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const updateUser = (userData) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
