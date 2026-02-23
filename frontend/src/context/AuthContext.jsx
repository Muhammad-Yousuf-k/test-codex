import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const value = useMemo(
    () => ({
      user,
      setUser,
      darkMode,
      setDarkMode,
      toggleTheme: () => setDarkMode((prev) => !prev)
    }),
    [darkMode, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
