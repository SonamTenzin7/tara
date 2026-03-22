import { useState, useEffect, useCallback } from "react";
import {
  loginWithTelegram,
  getMe,
  clearToken,
  getToken,
  AuthUser,
} from "../api/client";

// Telegram WebApp global type
declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string } };
  }
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: getToken(),
    loading: true,
    error: null,
  });

  // On mount: if we already have a token, fetch the user profile.
  // Otherwise, grab initData from Telegram and login automatically.
  const initialize = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      // ── Case 1: already have a stored token ──────────────────────────────
      if (getToken()) {
        try {
          const user = await getMe();
          setState({ user, token: getToken(), loading: false, error: null });
          return;
        } catch {
          // Token expired or invalid — fall through to re-login
          clearToken();
        }
      }

      // ── Case 2: inside Telegram, use initData ────────────────────────────
      const initData = window.Telegram?.WebApp?.initData;
      if (initData) {
        const { user, token } = await loginWithTelegram(initData);
        setState({ user, token, loading: false, error: null });
        return;
      }

      // ── Case 3: running in browser outside Telegram (dev/PWA) ───────────
      // mockEnv.ts already mocked the Telegram environment, so try again
      // after a short delay to let the mock initialize
      await new Promise((r) => setTimeout(r, 300));
      const initDataAfterMock = window.Telegram?.WebApp?.initData;
      if (initDataAfterMock) {
        const { user, token } = await loginWithTelegram(initDataAfterMock);
        setState({ user, token, loading: false, error: null });
        return;
      }

      setState({
        user: null,
        token: null,
        loading: false,
        error: "No Telegram initData available",
      });
    } catch (err: any) {
      setState({
        user: null,
        token: null,
        loading: false,
        error: err.message || "Login failed",
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const logout = () => {
    clearToken();
    setState({ user: null, token: null, loading: false, error: null });
  };

  return { ...state, logout, retry: initialize };
}
