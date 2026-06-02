import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

const STORAGE_KEY = "mm_admin_token";

interface AdminAuthCtx {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthCtx | null>(null);

/** Read the stored admin token (used by API callers to authorize requests). */
export function getAdminToken(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function clearAdminToken() {
  localStorage.removeItem(STORAGE_KEY);
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem(STORAGE_KEY));

  // Validates the password against the server, which returns a signed token.
  // The password is never stored in the client bundle anymore.
  const login = useCallback(async (password: string) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) return false;
      const { token } = await res.json();
      if (!token) return false;
      localStorage.setItem(STORAGE_KEY, token);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be inside AdminAuthProvider");
  return ctx;
}
