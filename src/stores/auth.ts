import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
}

/**
 * Client-side auth state. Source of truth is Supabase — this store
 * caches it so components don't need async reads on every render.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  clearSession: () => set({ user: null, session: null }),
}));
