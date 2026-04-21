import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { categories } from '../services/categories';
import { type EventItem, fetchJoinedEvents, leaveEvent } from '../services/events';
import { fetchAvatarUrl, uploadAvatar } from '../services/avatar';

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
      gradientCard: 'from-violet-50 to-indigo-50',
      iconRing: 'ring-violet-200/60 bg-white/60',
    }
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

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
        'group relative flex h-full flex-col overflow-hidden rounded-3xl',
        'border border-white/60 bg-white shadow-md',
        'transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl',
      ].join(' ')}
    >
      {/* Gradient header band */}
      <div className={`relative bg-gradient-to-br ${cat.gradientCard} p-6`}>
        {/* Decorative circle */}
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15 transition-transform duration-500 group-hover:scale-125" />

        <div className="relative flex items-start justify-between gap-3">
          {/* Emoji icon */}
          <span
            className={[
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ring-1',
              cat.iconRing,
            ].join(' ')}
            aria-hidden="true"
          >
            {cat.emoji}
          </span>

          {/* Type pill top-right */}
          <span
            className={[
              'mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1',
              cat.pill,
            ].join(' ')}
          >
            {event.type}
          </span>
        </div>

        {/* Event name */}
        <h3 className="mt-4 text-lg font-bold leading-snug text-gray-900 sm:text-xl">
          {event.name}
        </h3>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Date & location */}
        <div className="flex flex-col gap-1.5 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span className="text-base" aria-hidden="true">📅</span>
            {event.date}
          </span>
          {event.location && (
            <span className="flex items-center gap-2">
              <span className="text-base" aria-hidden="true">📍</span>
              {event.location}
            </span>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">
            {event.description}
          </p>
        )}

        {/* Spacer pushes footer to bottom */}
        <div className="flex-1" />

        {/* Footer CTAs */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <Link
            to={`/events/${cat.slug}/${event.id}`}
            className="flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-violet-700 hover:shadow-md"
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
              'rounded-full px-4 py-2 text-xs font-semibold ring-1 transition-all duration-200',
              leaving
                ? 'cursor-not-allowed opacity-50 ring-gray-200 text-gray-400'
                : 'ring-red-200 text-red-500 hover:bg-red-50 hover:ring-red-300',
            ].join(' ')}
          >
            {leaving ? 'Leaving…' : 'Leave event'}
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Profile page ─────────────────────────────────────────────────────────────

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [leavingId, setLeavingId] = useState<string | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Load avatar
  useEffect(() => {
    if (!user) return;
    fetchAvatarUrl(user.id).then(setAvatarUrl).catch(() => {});
  }, [user]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    // Show preview immediately
    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);
    setAvatarUploading(true);
    try {
      const url = await uploadAvatar(user.id, file);
      setAvatarUrl(url);
    } catch {
      // On failure keep the preview; user can retry
    } finally {
      setAvatarUploading(false);
      // Reset input so the same file can be re-selected if needed
      e.target.value = '';
    }
  }

  async function handleLeave(eventId: string) {
    setLeavingId(eventId);
    try {
      await leaveEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } finally {
      setLeavingId(null);
    }
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
    <div className="mx-auto max-w-7xl px-6 pb-28 pt-10 sm:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">

      {/* ── Sidebar: cover card ── */}
      <div className="w-full lg:sticky lg:top-24 lg:w-80 lg:shrink-0">

      {/* Cover card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-400 via-indigo-400 to-pink-400 shadow-xl">
        {/* Decorative circles */}
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/10" />
        <div className="absolute right-1/3 top-4 h-16 w-16 rounded-full bg-white/10" />

        <div className="relative px-8 pb-10 pt-10">
          {/* Avatar row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="relative shrink-0">
                {/* Clickable avatar */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20 ring-4 ring-white/60 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-white sm:h-24 sm:w-24"
                  aria-label="Change profile photo"
                  title="Change profile photo"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white sm:text-3xl">{initials}</span>
                  )}

                  {/* Hover overlay with camera icon */}
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {avatarUploading ? (
                      <svg className="h-6 w-6 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white" aria-hidden="true">
                        <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                        <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                </button>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleAvatarChange}
                />

                {/* Online dot */}
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />
              </div>

              {/* Name / email */}
              <div className="mb-1 min-w-0">
                <h1 className="truncate text-xl font-bold text-white sm:text-2xl">{displayName}</h1>
                <p className="truncate text-sm text-white/80">{email}</p>
              </div>
            </div>
          </div>

          {/* Member since */}
          <p className="mt-4 text-xs font-medium uppercase tracking-widest text-white/70">
            Member since {memberSince}
          </p>

          {/* Stats row */}
          <div className="mt-5 grid grid-cols-3 divide-x divide-white/20 rounded-2xl bg-white/15 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-0.5 px-3 py-4">
              <span className="text-xl font-bold text-white sm:text-2xl">{events.length}</span>
              <span className="text-center text-[10px] font-semibold uppercase tracking-wider text-white/70 sm:text-xs">Events joined</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-3 py-4">
              <span className="text-xl font-bold text-white sm:text-2xl">—</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70 sm:text-xs">Followers</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-3 py-4">
              <span className="text-xl font-bold text-white sm:text-2xl">—</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70 sm:text-xs">Following</span>
            </div>
          </div>
        </div>
      </div>
      </div>{/* end sidebar */}

      {/* ── Main content: My Events ── */}
      <div className="min-w-0 flex-1">
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

        {/* Event grid */}
        {!eventsLoading && events.length > 0 && (
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
      </div>{/* end main content */}

      </div>{/* end flex row */}
    </div>
  );
}
