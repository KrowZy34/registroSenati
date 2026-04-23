import { useEffect, useState } from "react";
import type { Account } from "@/lib/store";

const KEY = "sim_session_v1";

function read(): Account | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Account) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [account, setAccount] = useState<Account | null>(() => read());

  useEffect(() => {
    const update = () => setAccount(read());
    window.addEventListener("sim-auth-update", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("sim-auth-update", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const login = (acc: Account) => {
    localStorage.setItem(KEY, JSON.stringify(acc));
    window.dispatchEvent(new CustomEvent("sim-auth-update"));
    setAccount(acc);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent("sim-auth-update"));
    setAccount(null);
  };

  return { account, login, logout };
}
