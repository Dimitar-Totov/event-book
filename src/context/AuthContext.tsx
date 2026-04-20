import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

// ─── Public context shape ─────────────────────────────────────────────────────

export interface AuthContextType {
  /** Current logged-in user, or null when guest. */
  user: User | null;
  /** True when a user session is active. */
  isAuthenticated: boolean;
  /**
   * True while checking the stored session on startup,
   * or while an auth operation (register / login / logout) is in progress.
   */
  isLoading: boolean;
  /** Human-readable error from the last failed auth operation, or null. */
  error: string | null;
  /**
   * Register a new account.
   * Returns { requiresConfirmation: true } when Supabase sends a verification
   * email, { requiresConfirmation: false } when the user is logged in immediately,
   * or null on failure (error is set in state).
   */
  register(email: string, password: string): Promise<{ requiresConfirmation: boolean } | null>;
  /**
   * Log in with email + password.
   * Returns true on success, false on failure (error is set in state).
   */
  login(email: string, password: string): Promise<boolean>;
  /** Sign out and clear all session data. */
  logout(): Promise<void>;
  /** Dismiss the current error message. */
  clearError(): void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// ─── Validation helpers ───────────────────────────────────────────────────────

function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return 'Please enter a valid email address.';
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Za-z]/.test(password)) return 'Password must contain at least one letter.';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
  return null;
}

// ─── Supabase error → user-friendly message ───────────────────────────────────

function mapAuthError(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('user already registered') || msg.includes('already exists'))
    return 'An account with this email already exists. Try signing in instead.';

  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials'))
    return 'Incorrect email or password. Please try again.';

  if (msg.includes('email not confirmed'))
    return 'Please verify your email address before signing in.';

  if (msg.includes('email rate limit') || msg.includes('rate limit'))
    return 'Too many attempts. Please wait a moment and try again.';

  if (msg.includes('network') || msg.includes('fetch failed'))
    return 'Network error. Please check your connection and try again.';

  if (msg.includes('invalid email') || msg.includes('unable to validate email'))
    return 'Please enter a valid email address.';

  if (msg.includes('weak password') || (msg.includes('password') && msg.includes('characters')))
    return 'Password is too weak. Please choose a stronger password.';

  return message;
}

// ─── AuthProvider ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true on startup for session check
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Restore existing session from localStorage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Keep user state in sync whenever Supabase fires an auth event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Register ──────────────────────────────────────────────────────────────

  async function register(
    email: string,
    password: string,
  ): Promise<{ requiresConfirmation: boolean } | null> {
    const emailErr = validateEmail(email);
    if (emailErr) { setError(emailErr); return null; }

    const passwordErr = validatePassword(password);
    if (passwordErr) { setError(passwordErr); return null; }

    setIsLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setIsLoading(false);

    if (authError) {
      setError(mapAuthError(authError.message));
      return null;
    }

    // session === null → Supabase sent a confirmation email
    const requiresConfirmation = !!data.user && !data.session;
    return { requiresConfirmation };
  }

  // ── Login ────────────────────────────────────────────────────────────────

  async function login(email: string, password: string): Promise<boolean> {
    const emailErr = validateEmail(email);
    if (emailErr) { setError(emailErr); return false; }

    if (!password.trim()) { setError('Password is required.'); return false; }

    setIsLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsLoading(false);

    if (authError) {
      setError(mapAuthError(authError.message));
      return false;
    }

    return true;
  }

  // ── Logout ───────────────────────────────────────────────────────────────

  async function logout(): Promise<void> {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setError(null);
    setIsLoading(false);
  }

  // ── clearError ────────────────────────────────────────────────────────────

  function clearError(): void {
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        register,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
