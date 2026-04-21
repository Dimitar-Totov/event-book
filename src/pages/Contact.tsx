import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { sendContactMessage } from '../services/contact';


// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessMessage({ name }: { name: string }) {
  return (
    <div className="glass rounded-[2rem] p-10 sm:p-14">
      <div className="flex flex-col items-center gap-5 text-center">
        {/* Animated check circle */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-white" aria-hidden="true">
            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Message sent!</h2>
          <p className="text-gray-500">
            Thanks{name ? `, ${name}` : ''}! We've received your message and will get back to you soon.
          </p>
        </div>

        <div className="mt-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-4 text-sm text-emerald-700">
          Your message was delivered to <span className="font-semibold">example@abv.bg</span>.
        </div>

        <p className="text-xs text-gray-400">
          You can send another message after signing out and back in, or refreshing the page.
        </p>
      </div>
    </div>
  );
}

// ─── Contact form ─────────────────────────────────────────────────────────────

function ContactForm({ userEmail }: { userEmail: string; userId: string }) {

  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!message.trim()) { setError('Message cannot be empty.'); return; }
    if (message.trim().length < 10) { setError('Message must be at least 10 characters.'); return; }

    setSubmitting(true);
    try {
      await sendContactMessage({ name: userEmail, message });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return <SuccessMessage name={userEmail} />;
  }

  return (
    <form className="glass rounded-[2rem] p-10 sm:p-14" onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Send a message</p>
          <h2 className="mt-2 text-xl font-semibold text-gray-900">We'd love to hear from you</h2>
          <p className="mt-1 text-sm text-gray-400">Sending as <span className="font-medium text-gray-600">{userEmail}</span></p>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="contact-message">
            Message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your event needs…"
            className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none ring-violet-400 transition focus:border-violet-400 focus:ring-2"
          />
          <p className="mt-1.5 text-right text-xs text-gray-400">{message.length} characters</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
              <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm0-10a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 5Zm0 7.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="gradient-iris flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
        >
          {submitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Sending…
            </>
          ) : (
            'Send message'
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Guest prompt ─────────────────────────────────────────────────────────────

function GuestPrompt() {
  return (
    <div className="glass rounded-[2rem] p-10 sm:p-14">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 ring-1 ring-violet-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-violet-500" aria-hidden="true">
            <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">Sign in to send a message</h2>
          <p className="text-sm text-gray-500">
            You need to be signed in to contact us. It only takes a moment.
          </p>
        </div>
        <Link
          to="/auth"
          className="gradient-iris rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:opacity-90 active:scale-95"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const Contact = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="px-6 py-16 sm:px-8 lg:px-10 xl:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

        {/* Info card */}
        <div className="glass space-y-8 rounded-[2rem] p-10 sm:p-14">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Get in touch</p>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Questions, demos, or{' '}
              <span className="gradient-iris-text">partnership inquiries.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-gray-500">
              Reach out and our team will help you build the ideal event experience for your next gathering.
            </p>
          </div>

          <div className="glass-dark grid gap-6 rounded-3xl p-7">
            {[
              { label: 'Address', content: '198 Event Lane, Suite 210\nSeattle, WA 98101', accent: 'text-violet-500' },
              { label: 'Email', content: 'hello@eventbook.com', href: 'mailto:hello@eventbook.com', accent: 'text-sky-500' },
              { label: 'Phone', content: '+1 (206) 555-0174', accent: 'text-pink-500' },
            ].map(({ label, content, href, accent }) => (
              <div key={label}>
                <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${accent}`}>{label}</p>
                {href ? (
                  <a href={href} className="mt-2 inline-block text-base text-gray-700 transition hover:text-violet-600">{content}</a>
                ) : (
                  <p className="mt-2 whitespace-pre-line text-base text-gray-600">{content}</p>
                )}
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="overflow-hidden rounded-3xl border border-violet-100">
            <div className="gradient-iris-subtle flex h-64 flex-col items-center justify-center gap-4 p-8 text-center">
              <span className="text-4xl">📍</span>
              <div>
                <p className="text-base font-semibold text-gray-900">Seattle, WA 98101</p>
                <p className="mt-1 text-sm text-gray-500">View our location on Google Maps.</p>
              </div>
              <a
                href="https://www.google.com/maps/place/Seattle,+WA+98101"
                target="_blank"
                rel="noreferrer"
                className="gradient-iris rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:opacity-90 active:scale-95"
              >
                Open map
              </a>
            </div>
          </div>
        </div>

        {/* Right panel */}
        {isAuthenticated && user?.email
          ? <ContactForm userEmail={user.email} userId={user.id} />
          : <GuestPrompt />
        }
      </div>
    </section>
  );
};

export default Contact;
