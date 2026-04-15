import { useState } from 'react';

// ── Shared input ────────────────────────────────────────────────────────────
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

// ── Sign-in form ─────────────────────────────────────────────────────────────
const SignInForm = ({ visible }: { visible: boolean }) => (
  <form
    onSubmit={(e) => e.preventDefault()}
    className={`flex w-1/2 flex-col items-center justify-center gap-6 px-10 py-12 transition-all duration-700
      max-lg:w-full max-lg:px-6 max-lg:py-8
      ${visible ? 'opacity-100 delay-300' : 'pointer-events-none opacity-0'}`}
  >
    <div className="mb-2 text-center">
      <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
      <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
    </div>

    <div className="flex w-full max-w-sm flex-col gap-4">
      <Input label="Email" id="signin-email" type="email" placeholder="you@example.com" autoComplete="email" />
      <Input label="Password" id="signin-password" type="password" placeholder="••••••••" autoComplete="current-password" />
    </div>

    <div className="flex w-full max-w-sm flex-col gap-3">
      <button
        type="submit"
        className="gradient-iris rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:opacity-90 active:scale-95"
      >
        Sign In
      </button>
      <a href="#" className="text-center text-xs text-gray-400 transition hover:text-violet-500">
        Forgot your password?
      </a>
    </div>
  </form>
);

// ── Sign-up form ─────────────────────────────────────────────────────────────
const SignUpForm = ({ visible }: { visible: boolean }) => (
  <form
    onSubmit={(e) => e.preventDefault()}
    className={`flex w-1/2 flex-col items-center justify-center gap-6 px-10 py-12 transition-all duration-700
      max-lg:w-full max-lg:px-6 max-lg:py-8
      ${visible ? 'opacity-100 delay-300' : 'pointer-events-none opacity-0'}`}
  >
    <div className="mb-2 text-center">
      <h2 className="text-2xl font-semibold text-gray-900">Create account</h2>
      <p className="mt-1 text-sm text-gray-500">Join Event Book for free</p>
    </div>

    <div className="flex w-full max-w-sm flex-col gap-4">
      <Input label="Full Name" id="signup-name" type="text" placeholder="Jane Smith" autoComplete="name" />
      <Input label="Email" id="signup-email" type="email" placeholder="you@example.com" autoComplete="email" />
      <Input label="Password" id="signup-password" type="password" placeholder="••••••••" autoComplete="new-password" />
      <Input label="Confirm Password" id="signup-confirm" type="password" placeholder="••••••••" autoComplete="new-password" />
    </div>

    <div className="w-full max-w-sm">
      <button
        type="submit"
        className="gradient-iris w-full rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:opacity-90 active:scale-95"
      >
        Create Account
      </button>
    </div>
  </form>
);

// ── Overlay panel ────────────────────────────────────────────────────────────
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
    {/* Animated iridescent gradient */}
    <div className="gradient-iris absolute inset-0" />

    {/* Glassmorphism layer */}
    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />

    {/* Decorative blobs */}
    <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
    <div className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
    <div className="absolute left-1/3 top-1/3 h-40 w-40 rounded-full bg-pink-300/20 blur-2xl" />

    {/* Content */}
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

// ── Mobile toggle tabs ────────────────────────────────────────────────────────
const MobileTabs = ({ isSignUp, onToggle }: { isSignUp: boolean; onToggle: () => void }) => (
  <div className="flex rounded-2xl border border-gray-200 bg-white/60 p-1 lg:hidden">
    <button
      onClick={() => isSignUp && onToggle()}
      className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${!isSignUp ? 'gradient-iris text-white shadow' : 'text-gray-400 hover:text-gray-700'}`}
    >
      Sign In
    </button>
    <button
      onClick={() => !isSignUp && onToggle()}
      className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${isSignUp ? 'gradient-iris text-white shadow' : 'text-gray-400 hover:text-gray-700'}`}
    >
      Sign Up
    </button>
  </div>
);

// ── Main auth page ────────────────────────────────────────────────────────────
const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      {/* Card */}
      <div className="glass relative w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl shadow-violet-200/60">

        {/* Desktop: side-by-side forms */}
        <div className="hidden lg:flex lg:h-[620px]">
          <SignInForm visible={!isSignUp} />
          <SignUpForm visible={isSignUp} />
          <OverlayPanel isSignUp={isSignUp} onToggle={() => setIsSignUp((v) => !v)} />
        </div>

        {/* Mobile: stacked with tabs */}
        <div className="flex flex-col gap-4 p-6 lg:hidden">
          <MobileTabs isSignUp={isSignUp} onToggle={() => setIsSignUp((v) => !v)} />
          {isSignUp ? <SignUpForm visible={true} /> : <SignInForm visible={true} />}
        </div>
      </div>
    </div>
  );
};

export default Auth;
