import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('me.php')
      .then((data) => setUser(data.user))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api.post('login.php', { email, password });
    setUser(data);
    return data;
  }

  async function register(payload) {
    const data = await api.post('register.php', payload);
    setUser(data);
    return data;
  }

  async function logout() {
    await api.post('logout.php', {});
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
