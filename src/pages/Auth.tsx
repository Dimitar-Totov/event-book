import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// ─── Shared Input ─────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = ({ label, id, ...props }: InputProps) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-semibold uppercase tracking-widest text-gray-400">
      {label}
    </label>
    <input
      id={id}
      {...props}
      className="rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-violet-400 transition focus:border-violet-400 focus:ring-2"
    />
  </div>
);

// ─── Error banner ─────────────────────────────────────────────────────────────

const ErrorBanner = ({ message }: { message: string }) => (
  <div
    role="alert"
    className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0">
      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
    </svg>
    <span>{message}</span>
  </div>
);

// ─── Loading spinner (inline) ─────────────────────────────────────────────────

const Spinner = () => (
  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
);

// ─── Sign-in form ─────────────────────────────────────────────────────────────

interface SignInFormProps {
  visible: boolean;
  isLoading: boolean;
  error: string | null;
  onSubmit: (email: string, password: string) => void;
}

const SignInForm = ({ visible, isLoading, error, onSubmit }: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(email, password);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-1/2 flex-col items-center justify-center gap-5 px-10 py-12 transition-all duration-700
        max-lg:w-full max-lg:px-6 max-lg:py-8
        ${visible ? 'opacity-100 delay-300' : 'pointer-events-none opacity-0'}`}
    >
      <div className="mb-1 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
        <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-4">
        <Input
          label="Email"
          id="signin-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          id="signin-password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <div className="w-full max-w-sm"><ErrorBanner message={error} /></div>}

      <div className="flex w-full max-w-sm flex-col gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="gradient-iris flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? <><Spinner /> Signing in…</> : 'Sign In'}
        </button>
        <a href="#" className="text-center text-xs text-gray-400 transition hover:text-violet-500">
          Forgot your password?
        </a>
      </div>
    </form>
  );
};

// ─── Sign-up form ─────────────────────────────────────────────────────────────

interface SignUpFormProps {
  visible: boolean;
  isLoading: boolean;
  error: string | null;
  onSubmit: (email: string, password: string, confirmPassword: string, username: string) => void;
  success: boolean;
  successEmail: string;
}

const SignUpForm = ({ visible, isLoading, error, onSubmit, success, successEmail }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(email, password, confirmPassword, username);
  }

  const formClass = `flex w-1/2 flex-col items-center justify-center gap-5 px-10 py-12 transition-all duration-700
    max-lg:w-full max-lg:px-6 max-lg:py-8
    ${visible ? 'opacity-100 delay-300' : 'pointer-events-none opacity-0'}`;

  // ── Email confirmation success screen ─────────────────────────────────────
  if (success) {
    return (
      <div className={formClass}>
        <div className="flex w-full max-w-sm flex-col items-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 ring-4 ring-emerald-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-8 w-8 text-emerald-500">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.06-1.06l-3.75 3.75-1.72-1.72a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.28-4.28Z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Check your email!</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              We've sent a verification link to{' '}
              <span className="font-semibold text-gray-700">{successEmail}</span>.
              Click the link to activate your account.
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Didn't receive it? Check your spam folder or try registering again.
          </p>
        </div>
      </div>
    );
  }

  // ── Registration form ─────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <div className="mb-1 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Create account</h2>
        <p className="mt-1 text-sm text-gray-500">Join Event Book for free</p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-4">
        <Input
          label="Email"
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Username"
          id="signup-username"
          type="text"
          placeholder="e.g. johndoe"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          label="Password"
          id="signup-password"
          type="password"
          placeholder="Min. 8 chars, 1 letter & 1 number"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm Password"
          id="signup-confirm"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {error && <div className="w-full max-w-sm"><ErrorBanner message={error} /></div>}

      <div className="w-full max-w-sm">
        <button
          type="submit"
          disabled={isLoading}
          className="gradient-iris flex w-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? <><Spinner /> Creating account…</> : 'Create Account'}
        </button>
      </div>
    </form>
  );
};

// ─── Overlay panel ────────────────────────────────────────────────────────────

interface OverlayPanelProps {
  isSignUp: boolean;
  onToggle: () => void;
}

const OverlayPanel = ({ isSignUp, onToggle }: OverlayPanelProps) => (
  <div
    className={`absolute top-0 h-full w-1/2 overflow-hidden rounded-2xl transition-all duration-700 ease-in-out
      max-lg:hidden
      ${isSignUp ? 'left-0' : 'left-1/2'}`}
  >
    <div className="gradient-iris absolute inset-0" />
    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
    <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
    <div className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
    <div className="absolute left-1/3 top-1/3 h-40 w-40 rounded-full bg-pink-300/20 blur-2xl" />

    <div className="relative flex h-full flex-col items-center justify-center gap-6 px-10 text-center text-white">
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white/25 backdrop-blur-sm ring-1 ring-white/40 shadow-lg">
        <img src="/logo.png" alt="Event Book" className="h-full w-full rounded-2xl object-contain" />
      </div>

      {isSignUp ? (
        <>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Already have an account?</p>
            <h3 className="mt-2 text-2xl font-semibold drop-shadow-sm">Welcome back!</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              Sign in to manage your events and pick up right where you left off.
            </p>
          </div>
          <button
            onClick={onToggle}
            className="rounded-xl border border-white/40 bg-white/20 px-8 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30 active:scale-95"
          >
            Sign In
          </button>
        </>
      ) : (
        <>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">New here?</p>
            <h3 className="mt-2 text-2xl font-semibold drop-shadow-sm">Start planning today</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              Create your free account and bring your events to life in minutes.
            </p>
          </div>
          <button
            onClick={onToggle}
            className="rounded-xl border border-white/40 bg-white/20 px-8 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30 active:scale-95"
          >
            Sign Up
          </button>
        </>
      )}
    </div>
  </div>
);

// ─── Mobile toggle tabs ───────────────────────────────────────────────────────

const MobileTabs = ({ isSignUp, onToggle }: { isSignUp: boolean; onToggle: () => void }) => (
  <div className="flex rounded-2xl border border-gray-200 bg-white/60 p-1 lg:hidden">
    <button
      type="button"
      onClick={() => isSignUp && onToggle()}
      className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${!isSignUp ? 'gradient-iris text-white shadow' : 'text-gray-400 hover:text-gray-700'}`}
    >
      Sign In
    </button>
    <button
      type="button"
      onClick={() => !isSignUp && onToggle()}
      className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${isSignUp ? 'gradient-iris text-white shadow' : 'text-gray-400 hover:text-gray-700'}`}
    >
      Sign Up
    </button>
  </div>
);

// ─── Main Auth page ───────────────────────────────────────────────────────────

const Auth = () => {
  const { login, register, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);

  // Error routing: localError is for client-side checks (passwords don't match),
  // auth context error comes from Supabase.
  const [localError, setLocalError] = useState<string | null>(null);

  // Sign-up success state (email confirmation required)
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');

  // True once the initial session check completes (isLoading flips false for
  // the first time). After that, auth operations (login / register) must NOT
  // trigger the full-page spinner because it unmounts the forms and clears
  // the user's input.
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!isLoading) setInitialized(true);
  }, [isLoading]);

  // Redirect already-authenticated users away from this page
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/events', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  function handleToggle() {
    setIsSignUp((v) => !v);
    setLocalError(null);
    clearError();
    setSignUpSuccess(false);
  }

  async function handleSignIn(email: string, password: string) {
    setLocalError(null);
    clearError();
    const success = await login(email, password);
    if (success) navigate('/events');
  }

  async function handleSignUp(email: string, password: string, confirmPassword: string, username: string) {
    setLocalError(null);
    clearError();

    if (password !== confirmPassword) {
      setLocalError("Passwords don't match.");
      return;
    }

    setSignUpEmail(email.trim());
    const result = await register(email, password, username);

    if (result) {
      if (result.requiresConfirmation) {
        setSignUpSuccess(true);
      } else {
        // Email confirmation disabled in Supabase — user is logged in immediately
        navigate('/events');
      }
    }
  }

  // Merge errors: local (password mismatch) takes precedence over Supabase errors
  const signInError = !isSignUp ? (localError || error) : null;
  const signUpError = isSignUp ? (localError || error) : null;

  // Render a minimal loading screen only during the initial session check.
  // Do NOT block on isLoading here — that would unmount the forms during
  // login/register and wipe the user's typed input.
  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-100 border-t-violet-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="glass relative w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl shadow-violet-200/60">

        {/* Desktop: side-by-side forms */}
        <div className="hidden lg:flex lg:h-[620px]">
          <SignInForm
            visible={!isSignUp}
            isLoading={isLoading}
            error={signInError}
            onSubmit={handleSignIn}
          />
          <SignUpForm
            visible={isSignUp}
            isLoading={isLoading}
            error={signUpError}
            onSubmit={handleSignUp}
            success={signUpSuccess}
            successEmail={signUpEmail}
          />
          <OverlayPanel isSignUp={isSignUp} onToggle={handleToggle} />
        </div>

        {/* Mobile: stacked with tabs */}
        <div className="flex flex-col gap-4 p-6 lg:hidden">
          <MobileTabs isSignUp={isSignUp} onToggle={handleToggle} />
          {isSignUp ? (
            <SignUpForm
              visible={true}
              isLoading={isLoading}
              error={signUpError}
              onSubmit={handleSignUp}
              success={signUpSuccess}
              successEmail={signUpEmail}
            />
          ) : (
            <SignInForm
              visible={true}
              isLoading={isLoading}
              error={signInError}
              onSubmit={handleSignIn}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
