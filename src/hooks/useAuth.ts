import { useEffect, useState } from "react";
import type { Account } from "@/lib/supabase";
import { getAccountByUsername } from "@/lib/supabase";

const SESSION_KEY = "auth_session";

function readSession(): Account | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Account) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [account, setAccount] = useState<Account | null>(() => readSession());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setAccount(readSession());
    window.addEventListener("auth-update", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("auth-update", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const dbAccount = await getAccountByUsername(username);

      if (!dbAccount) {
        setError("Usuario no encontrado");
        setLoading(false);
        return false;
      }

      if (dbAccount.password !== password) {
        setError("Contraseña incorrecta");
        setLoading(false);
        return false;
      }

      // Guardar sesión sin la contraseña
      const sessionAccount: Account = {
        username: dbAccount.username,
        name: dbAccount.name,
        role: dbAccount.role,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionAccount));
      window.dispatchEvent(new CustomEvent("auth-update"));
      setAccount(sessionAccount);
      setLoading(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error en login";
      setError(message);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new CustomEvent("auth-update"));
    setAccount(null);
    setError(null);
  };

  return { account, login, logout, loading, error };
}
