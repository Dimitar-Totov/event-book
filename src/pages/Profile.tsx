import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { categories } from '../services/categories';
import { type EventItem, fetchJoinedEvents, leaveEvent } from '../services/events';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(email: string): string {
  const local = email.split('@')[0] ?? '';
  const parts = local.split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

function formatMemberSince(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getCatConfig(categoryLabel: string) {
  return (
    categories.find((c) => c.label === categoryLabel) ?? {
      emoji: '📅',
      slug: 'events',
      accent: 'text-violet-600',
      pill: 'bg-violet-50 text-violet-700 ring-violet-200',
      gradientOverlay: 'from-violet-400 to-indigo-500',
    }
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <span className="text-xs font-medium uppercase tracking-widest text-gray-400">{label}</span>
    </div>
  );
}

function EventCard({
  event,
  onLeave,
  leaving,
}: {
  event: EventItem;
  onLeave: (id: string) => void;
  leaving: boolean;
}) {
  const cat = getCatConfig(event.category);

  return (
    <article
      className={[
        'group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/60',
        'bg-white/70 p-5 shadow-md backdrop-blur-sm',
        'transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg',
      ].join(' ')}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${cat.gradientOverlay} rounded-l-2xl`} />

      <div className="pl-3">
        {/* Category + type pill row */}
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">{cat.emoji}</span>
          <span
            className={[
              'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1',
              cat.pill,
            ].join(' ')}
          >
            {event.type}
          </span>
        </div>

        {/* Name */}
        <h3 className="mt-2 text-base font-semibold leading-snug text-gray-900">
          {event.name}
        </h3>

        {/* Date & location */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span>📅 {event.date}</span>
          {event.location && <span>📍 {event.location}</span>}
        </div>
      </div>

      {/* Footer: chat + leave */}
      <div className="flex items-center justify-between pl-3">
        <Link
          to={`/events/${cat.slug}/${event.id}`}
          className={[
            'flex items-center gap-1 text-sm font-medium transition-colors duration-200',
            cat.accent,
            'hover:underline',
          ].join(' ')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
            <path fillRule="evenodd" d="M1 8.74c0 .983.713 1.825 1.69 1.943.764.092 1.534.162 2.31.208v2.36a.75.75 0 0 0 1.28.53l2.56-2.559c.24-.24.566-.375.905-.375H12a1.75 1.75 0 0 0 1.75-1.75V4.75A1.75 1.75 0 0 0 12 3H4A1.75 1.75 0 0 0 2.25 4.75v2.12c-.76.18-1.25.873-1.25 1.87ZM4 4.5h8a.25.25 0 0 1 .25.25v3.75A.25.25 0 0 1 12 8.75H9.745a2.25 2.25 0 0 0-1.59.659L6.5 11.06V9.5a.75.75 0 0 0-.75-.75H4a.25.25 0 0 1-.25-.25V4.75A.25.25 0 0 1 4 4.5Z" clipRule="evenodd" />
          </svg>
          Open chat
        </Link>

        <button
          onClick={() => onLeave(event.id)}
          disabled={leaving}
          className={[
            'rounded-full px-3 py-1 text-xs font-semibold ring-1 transition-all duration-200',
            leaving
              ? 'cursor-not-allowed opacity-50 ring-gray-200 text-gray-400'
              : 'ring-red-200 text-red-500 hover:bg-red-50 hover:ring-red-300',
          ].join(' ')}
        >
          {leaving ? 'Leaving…' : 'Leave'}
        </button>
      </div>
    </article>
  );
}

// ─── Profile page ─────────────────────────────────────────────────────────────

export default function Profile() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [leavingId, setLeavingId] = useState<string | null>(null);

  // Redirect guests
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Load joined events
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    setEventsLoading(true);
    fetchJoinedEvents()
      .then((data) => { if (!cancelled) { setEvents(data); setEventsLoading(false); } })
      .catch(() => { if (!cancelled) setEventsLoading(false); });
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  async function handleLeave(eventId: string) {
    setLeavingId(eventId);
    try {
      await leaveEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } finally {
      setLeavingId(null);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  // Loading / redirect guard
  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-100 border-t-violet-500" />
      </div>
    );
  }

  const email = user.email ?? '';
  const displayName = email.split('@')[0] ?? 'User';
  const initials = getInitials(email);
  const memberSince = user.created_at ? formatMemberSince(user.created_at) : '—';

  return (
    <div className="mx-auto max-w-3xl px-6 pb-28 pt-10 sm:px-8">

      {/* Cover card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-500 to-pink-500 shadow-xl">
        {/* Decorative circles */}
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/10" />
        <div className="absolute right-1/3 top-4 h-16 w-16 rounded-full bg-white/10" />

        <div className="relative px-8 pb-10 pt-10">
          {/* Avatar */}
          <div className="flex items-end gap-5">
            <div className="relative">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white ring-4 ring-white/60 backdrop-blur-sm sm:h-24 sm:w-24 sm:text-3xl"
                aria-label={`Avatar for ${displayName}`}
              >
                {initials}
              </div>
              {/* Online dot */}
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-400 sm:h-4 sm:w-4" />
            </div>

            {/* Name / email */}
            <div className="mb-1 flex-1 min-w-0">
              <h1 className="truncate text-2xl font-bold text-white sm:text-3xl">{displayName}</h1>
              <p className="truncate text-sm text-white/70">{email}</p>
            </div>

            {/* Sign out button */}
            <button
              onClick={handleLogout}
              className="mb-1 shrink-0 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
            >
              Sign out
            </button>
          </div>

          {/* Member since */}
          <p className="mt-4 text-xs font-medium uppercase tracking-widest text-white/60">
            Member since {memberSince}
          </p>

          {/* Stats row */}
          <div className="mt-6 flex items-center gap-8 rounded-2xl bg-white/15 px-6 py-4 backdrop-blur-sm">
            <StatCard value={events.length} label="Events joined" />
            <div className="h-8 w-px bg-white/20" />
            <StatCard value="—" label="Followers" />
            <div className="h-8 w-px bg-white/20" />
            <StatCard value="—" label="Following" />
          </div>
        </div>
      </div>

      {/* My Events section */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">My Events</h2>
          {!eventsLoading && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500">
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </span>
          )}
        </div>

        {/* Loading */}
        {eventsLoading && (
          <div className="mt-8 flex justify-center py-12">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-violet-100 border-t-violet-500" />
          </div>
        )}

        {/* Empty state */}
        {!eventsLoading && events.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-violet-200 bg-violet-50/50 px-8 py-14 text-center">
            <p className="text-4xl" aria-hidden="true">🎟️</p>
            <p className="mt-3 text-base font-semibold text-gray-700">No events yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Browse upcoming events and reserve your spot!
            </p>
            <Link
              to="/events"
              className="mt-5 inline-block rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-violet-700 hover:shadow-md"
            >
              Explore events
            </Link>
          </div>
        )}

        {/* Event list */}
        {!eventsLoading && events.length > 0 && (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {events.map((event, i) => (
              <li
                key={event.id}
                style={{ animationDelay: `${i * 60}ms` }}
                className="animate-fade-in-up"
              >
                <EventCard
                  event={event}
                  onLeave={handleLeave}
                  leaving={leavingId === event.id}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
