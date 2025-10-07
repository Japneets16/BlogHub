import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { request } from "../api/client";

const AuthContext = createContext(null);

function getStoredToken() {
  return window.localStorage.getItem("bloghub_token");
}

function setStoredToken(token) {
  if (token) {
    window.localStorage.setItem("bloghub_token", token);
  } else {
    window.localStorage.removeItem("bloghub_token");
  }
}

function getStoredUser() {
  const raw = window.localStorage.getItem("bloghub_user");
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function setStoredUser(user) {
  if (user) {
    window.localStorage.setItem("bloghub_user", JSON.stringify(user));
  } else {
    window.localStorage.removeItem("bloghub_user");
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const syncAuth = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    setStoredToken(nextToken);
    setStoredUser(nextUser);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadCurrentUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await request("/user/me", { token });
        if (!isMounted) {
          return;
        }
        syncAuth(token, response.user);
        setError(null);
      } catch (loadError) {
        if (isMounted) {
          syncAuth(null, null);
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [token, syncAuth]);

  const login = useCallback(async (credentials) => {
    const response = await request("/user/login", {
      method: "POST",
      body: credentials,
    });
    syncAuth(response.token, response.user);
    setError(null);
    return response.user;
  }, [syncAuth]);

  const signup = useCallback(async (details) => {
    const response = await request("/user/signup", {
      method: "POST",
      body: details,
    });
    syncAuth(response.token, response.user);
    setError(null);
    return response.user;
  }, [syncAuth]);

  const logout = useCallback(() => {
    syncAuth(null, null);
  }, [syncAuth]);

  const updateProfile = useCallback(async (updates) => {
    if (!token) {
      throw new Error("You need to be logged in");
    }
    const response = await request("/user/profile", {
      method: "PUT",
      body: updates,
      token,
    });
    syncAuth(token, response.user);
    return response.user;
  }, [token, syncAuth]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
  }), [user, token, loading, error, login, signup, logout, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
