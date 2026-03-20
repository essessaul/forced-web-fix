import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProfile, getSession, signIn as signInService, signOut as signOutService, signUp as signUpService } from "../services/authService";
import { hasSupabase, supabase } from "../lib/supabase";

const AuthContext = createContext(null);

const DEMO_LOGIN = "SaulPlaya";
const DEMO_PASSWORD = "Formula5181";
const DEMO_STORAGE_KEY = "pevh_demo_admin_session";

function makeDemoSession() {
  return {
    user: {
      id: "demo-admin-user",
      email: "admin@playa.com",
      user_metadata: {
        role: "admin",
        display_name: "Saul Playa",
        is_demo_admin: true,
      },
    },
  };
}

function makeDemoProfile() {
  return {
    id: "demo-admin-user",
    email: "admin@playa.com",
    display_name: "Saul Playa",
    role: "admin",
    is_demo_admin: true,
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const storedDemo = localStorage.getItem(DEMO_STORAGE_KEY);

      if (storedDemo && mounted) {
        setSession(makeDemoSession());
        setProfile(makeDemoProfile());
        setLoading(false);
        return;
      }

      if (!hasSupabase) {
        if (mounted) setLoading(false);
        return;
      }

      const current = await getSession();
      if (!mounted) return;

      setSession(current);

      if (current?.user?.id) {
        const prof = await getProfile(current.user.id);
        if (mounted) {
          setProfile(
            prof || {
              id: current.user.id,
              email: current.user.email,
              display_name: current.user.user_metadata?.display_name || "User",
              role: current.user.user_metadata?.role || "guest",
            }
          );
        }
      }

      setLoading(false);
    }

    load();

    if (hasSupabase && supabase) {
      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        const storedDemo = localStorage.getItem(DEMO_STORAGE_KEY);
        if (storedDemo) return;

        setSession(newSession);
        if (newSession?.user?.id) {
          const prof = await getProfile(newSession.user.id);
          setProfile(
            prof || {
              id: newSession.user.id,
              email: newSession.user.email,
              display_name: newSession.user.user_metadata?.display_name || "User",
              role: newSession.user.user_metadata?.role || "guest",
            }
          );
        } else {
          setProfile(null);
        }
      });

      return () => {
        mounted = false;
        listener.subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(() => ({
    session,
    profile,
    loading,
    async signIn(email, password) {
      if (email === DEMO_LOGIN && password === DEMO_PASSWORD) {
        localStorage.setItem(DEMO_STORAGE_KEY, "1");
        const demoSession = makeDemoSession();
        const demoProfile = makeDemoProfile();
        setSession(demoSession);
        setProfile(demoProfile);
        return { error: null, data: demoSession };
      }

      if (!hasSupabase) {
        return { error: new Error("Invalid login. Use SaulPlaya / Formula5181.") };
      }

      const result = await signInService(email, password);
      if (result?.error) return result;

      const nextSession = await getSession();
      if (nextSession?.user?.id) {
        const prof = await getProfile(nextSession.user.id);
        setSession(nextSession);
        setProfile(
          prof || {
            id: nextSession.user.id,
            email: nextSession.user.email,
            display_name: nextSession.user.user_metadata?.display_name || "User",
            role: nextSession.user.user_metadata?.role || "guest",
          }
        );
      }

      return result;
    },
    async signUp(email, password, role, displayName) {
      if (!hasSupabase) {
        return { error: new Error("Signup requires Supabase. Demo admin login is SaulPlaya / Formula5181.") };
      }
      return signUpService(email, password, role, displayName);
    },
    async signOut() {
      localStorage.removeItem(DEMO_STORAGE_KEY);

      if (!hasSupabase) {
        setSession(null);
        setProfile(null);
        return;
      }

      await signOutService();
      setSession(null);
      setProfile(null);
    }
  }), [session, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
