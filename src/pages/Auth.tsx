import { useState } from 'react';

// ── Shared input ────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = ({ label, id, ...props }: InputProps) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-medium uppercase tracking-widest text-slate-400">
      {label}
    </label>
    <input
      id={id}
      {...props}
      className="rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
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
      <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
      <p className="mt-1 text-sm text-slate-400">Sign in to your account</p>
    </div>

    <div className="flex w-full max-w-sm flex-col gap-4">
      <Input label="Email" id="signin-email" type="email" placeholder="you@example.com" autoComplete="email" />
      <Input label="Password" id="signin-password" type="password" placeholder="••••••••" autoComplete="current-password" />
    </div>

    <div className="flex w-full max-w-sm flex-col gap-3">
      <button
        type="submit"
        className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500 active:scale-95"
      >
        Sign In
      </button>
      <a href="#" className="text-center text-xs text-slate-500 transition hover:text-slate-300">
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
      <h2 className="text-2xl font-semibold text-white">Create account</h2>
      <p className="mt-1 text-sm text-slate-400">Join Event Book for free</p>
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
        className="w-full rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500 active:scale-95"
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
    {/* gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />

    {/* subtle noise texture overlay */}
    <div className="absolute inset-0 opacity-20 mix-blend-overlay"
      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
    />

    {/* decorative blobs */}
    <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
    <div className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

    {/* content */}
    <div className="relative flex h-full flex-col items-center justify-center gap-6 px-10 text-center text-white">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
        <img src="/logo.png" alt="Event Book" className="h-full w-full rounded-2xl object-contain" />
      </div>

      {isSignUp ? (
        <>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-indigo-200">Already have an account?</p>
            <h3 className="mt-2 text-2xl font-semibold">Welcome back!</h3>
            <p className="mt-2 text-sm leading-relaxed text-indigo-100/80">
              Sign in to manage your events and pick up right where you left off.
            </p>
          </div>
          <button
            onClick={onToggle}
            className="rounded-xl border border-white/30 bg-white/10 px-8 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
          >
            Sign In
          </button>
        </>
      ) : (
        <>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-indigo-200">New here?</p>
            <h3 className="mt-2 text-2xl font-semibold">Start planning today</h3>
            <p className="mt-2 text-sm leading-relaxed text-indigo-100/80">
              Create your free account and bring your events to life in minutes.
            </p>
          </div>
          <button
            onClick={onToggle}
            className="rounded-xl border border-white/30 bg-white/10 px-8 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
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
  <div className="flex rounded-xl bg-slate-800/60 p-1 lg:hidden">
    <button
      onClick={() => isSignUp && onToggle()}
      className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${!isSignUp ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
    >
      Sign In
    </button>
    <button
      onClick={() => !isSignUp && onToggle()}
      className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${isSignUp ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
    >
      Sign Up
    </button>
  </div>
);

// ── Main auth page ────────────────────────────────────────────────────────────
const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16">
      {/* Card */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/60">

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
