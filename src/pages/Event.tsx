import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { categories } from '../services/categories';
import { type EventItem, fetchEventsByCategory, fetchJoinedEventIds, joinEvent, leaveEvent } from '../services/events';

// ─── Sub-components ──────────────────────────────────────────────────────────

function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CalendarIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M4 1.75a.75.75 0 0 1 1.5 0V3h5V1.75a.75.75 0 0 1 1.5 0V3A2 2 0 0 1 14 5v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2V1.75ZM4.5 7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ─── Main categories grid ─────────────────────────────────────────────────────

function CategoriesPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-28 pt-16 sm:px-8">

      {/* Hero */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-600">
          <span className="gradient-iris inline-block h-2 w-2 rounded-full" />
          Discover what's happening
        </span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Explore event <span className="gradient-iris-text">categories</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-500">
          From mountain trails to concert halls — find the experience that speaks to you and book your spot today.
        </p>
      </div>

      {/* Category cards */}
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/events/${cat.slug}`}
            aria-label={`Browse ${cat.label}`}
            className={[
              'group relative overflow-hidden rounded-3xl border border-white/60',
              'bg-gradient-to-br',
              cat.gradientCard,
              'shadow-lg transition-all duration-300 ease-out',
              'hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-2xl',
              cat.glow,
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
            ].join(' ')}
          >
            {/* Animated gradient overlay */}
            <div
              className={[
                'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300',
                cat.gradientOverlay,
                'group-hover:opacity-100',
              ].join(' ')}
            />

            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/20 transition-transform duration-500 group-hover:scale-125" />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/15 transition-transform duration-500 group-hover:scale-110" />

            {/* Content */}
            <div className="relative p-8">
              <span
                className={[
                  'inline-flex h-16 w-16 items-center justify-center rounded-2xl text-3xl',
                  'ring-1 transition-transform duration-300 group-hover:scale-110',
                  cat.iconRing,
                ].join(' ')}
                aria-hidden="true"
              >
                {cat.emoji}
              </span>

              <h2 className="mt-5 text-xl font-semibold text-gray-900">{cat.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{cat.tagline}</p>

              <div className={`mt-6 flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${cat.accent}`}>
                Browse events
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Category detail page ─────────────────────────────────────────────────────

function CategoryPage({ slug }: { slug: string }) {
  const cat = categories.find((c) => c.slug === slug);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [joiningId, setJoiningId] = useState<string | null>(null);

  // Load events
  useEffect(() => {
    if (!cat) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchEventsByCategory(cat.label)
      .then((data) => {
        if (!cancelled) {
          setEvents(data);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load joined event IDs for authenticated users
  useEffect(() => {
    if (!isAuthenticated) { setJoinedIds(new Set()); return; }
    fetchJoinedEventIds().then(setJoinedIds).catch(() => {});
  }, [isAuthenticated]);

  const handleJoin = useCallback(async (eventId: string) => {
    if (!isAuthenticated) { navigate('/auth'); return; }
    setJoiningId(eventId);
    try {
      await joinEvent(eventId);
      setJoinedIds((prev) => new Set([...prev, eventId]));
    } finally {
      setJoiningId(null);
    }
  }, [isAuthenticated, navigate]);

  const handleLeave = useCallback(async (eventId: string) => {
    setJoiningId(eventId);
    try {
      await leaveEvent(eventId);
      setJoinedIds((prev) => { const next = new Set(prev); next.delete(eventId); return next; });
    } finally {
      setJoiningId(null);
    }
  }, []);

  if (!cat) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-28 text-center sm:px-8">
        <p className="text-lg font-semibold text-gray-900">Category not found.</p>
        <Link
          to="/events"
          className="mt-3 inline-block text-sm font-semibold text-violet-500 hover:underline"
        >
          Back to all categories
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-28 pt-14 sm:px-8">

      {/* Back link */}
      <Link
        to="/events"
        className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm transition-all duration-200 hover:border-violet-300 hover:text-violet-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M14 8a.75.75 0 0 1-.75.75H4.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L4.56 7.25H13.25A.75.75 0 0 1 14 8Z"
            clipRule="evenodd"
          />
        </svg>
        All categories
      </Link>

      {/* Category header */}
      <div className={[
        'mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-br p-10',
        cat.gradientCard,
        'border border-white/60 shadow-lg',
      ].join(' ')}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <span
            className={[
              'inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-4xl ring-1',
              cat.iconRing,
            ].join(' ')}
            aria-hidden="true"
          >
            {cat.emoji}
          </span>
          <div>
            <span className={`text-xs font-semibold uppercase tracking-widest ${cat.accent}`}>
              Category
            </span>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              {cat.label}
            </h1>
            <p className="mt-1 text-gray-500">{cat.tagline}</p>
          </div>
        </div>
      </div>

      {/* Events heading */}
      <div className="mt-12 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Upcoming events</h2>
        {!loading && !error && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500">
            {events.length} events
          </span>
        )}
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="mt-10 flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-100 border-t-violet-500" />
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-sm text-red-600">
          Failed to load events: {error}
        </div>
      )}

      {/* Event cards */}
      {!loading && !error && (
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.id}>
              <article
                className={[
                  'group relative h-full overflow-hidden rounded-3xl border border-white/60 bg-white/70',
                  'shadow-md backdrop-blur-sm transition-all duration-300 ease-out',
                  'hover:-translate-y-1 hover:scale-[1.015] hover:shadow-xl',
                  cat.glow,
                ].join(' ')}
              >
                {/* Top accent stripe */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${cat.gradientOverlay} opacity-80`} />

                <div className="p-7">
                  {/* Type pill */}
                  <span
                    className={[
                      'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1',
                      cat.pill,
                    ].join(' ')}
                  >
                    {event.type}
                  </span>

                  {/* Event name */}
                  <h3 className="mt-3 text-lg font-semibold leading-snug text-gray-900">
                    {event.name}
                  </h3>

                  {/* Date */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <CalendarIcon className={`h-4 w-4 shrink-0 ${cat.accent}`} />
                    <time>{event.date}</time>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-relaxed text-gray-500">{event.description}</p>

                  {/* Footer CTAs */}
                  <div className="mt-6 flex items-center gap-4">
                    {/* Join / Leave button */}
                    {joinedIds.has(event.id) ? (
                      <button
                        onClick={() => handleLeave(event.id)}
                        disabled={joiningId === event.id}
                        className={[
                          'flex items-center gap-1 text-sm font-semibold transition-colors duration-200',
                          joiningId === event.id ? 'cursor-not-allowed opacity-50' : '',
                          'text-emerald-600 hover:text-red-500',
                        ].join(' ')}
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                        {joiningId === event.id ? 'Leaving…' : 'Joined'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoin(event.id)}
                        disabled={joiningId === event.id}
                        className={[
                          'flex items-center gap-1 text-sm font-semibold transition-colors duration-200',
                          joiningId === event.id ? 'cursor-not-allowed opacity-50' : '',
                          cat.accent,
                        ].join(' ')}
                      >
                        {joiningId === event.id ? 'Joining…' : 'Reserve a spot'}
                        {joiningId !== event.id && (
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        )}
                      </button>
                    )}
                    <Link
                      to={`/events/${slug}/${event.id}`}
                      className="flex items-center gap-1 text-sm font-medium text-gray-400 transition-colors duration-200 hover:text-gray-600 focus-visible:outline-none focus-visible:underline"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
                        <path fillRule="evenodd" d="M1 8.74c0 .983.713 1.825 1.69 1.943.764.092 1.534.162 2.31.208v2.36a.75.75 0 0 0 1.28.53l2.56-2.559c.24-.24.566-.375.905-.375H12a1.75 1.75 0 0 0 1.75-1.75V4.75A1.75 1.75 0 0 0 12 3H4A1.75 1.75 0 0 0 2.25 4.75v2.12c-.76.18-1.25.873-1.25 1.87ZM4 4.5h8a.25.25 0 0 1 .25.25v3.75A.25.25 0 0 1 12 8.75H9.745a2.25 2.25 0 0 0-1.59.659L6.5 11.06V9.5a.75.75 0 0 0-.75-.75H4a.25.25 0 0 1-.25-.25V4.75A.25.25 0 0 1 4 4.5Z" clipRule="evenodd" />
                      </svg>
                      Chat
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

const Event = () => {
  const { category } = useParams<{ category?: string }>();
  return category ? <CategoryPage slug={category} /> : <CategoriesPage />;
};

export default Event;
