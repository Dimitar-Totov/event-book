import { Link, useParams } from 'react-router-dom';

// ─── Data ────────────────────────────────────────────────────────────────────

type Category = {
  slug: string;
  label: string;
  emoji: string;
  tagline: string;
  gradientCard: string;
  gradientOverlay: string;
  iconRing: string;
  accent: string;
  pill: string;
  glow: string;
};

const categories: Category[] = [
  {
    slug: 'music',
    label: 'Music Concerts',
    emoji: '🎵',
    tagline: 'Live performances, festivals & intimate gigs',
    gradientCard: 'from-violet-50 via-purple-50 to-pink-50',
    gradientOverlay: 'from-violet-400/20 via-purple-300/10 to-pink-400/20',
    iconRing: 'ring-violet-200 bg-violet-100',
    accent: 'text-violet-600',
    pill: 'bg-violet-100 text-violet-600 ring-violet-200',
    glow: 'hover:shadow-violet-200/70',
  },
  {
    slug: 'hiking',
    label: 'Mountain Hiking',
    emoji: '⛰️',
    tagline: 'Guided treks, day hikes & alpine expeditions',
    gradientCard: 'from-teal-50 via-emerald-50 to-sky-50',
    gradientOverlay: 'from-teal-400/20 via-emerald-300/10 to-sky-400/20',
    iconRing: 'ring-teal-200 bg-teal-100',
    accent: 'text-teal-600',
    pill: 'bg-teal-100 text-teal-600 ring-teal-200',
    glow: 'hover:shadow-teal-200/70',
  },
  {
    slug: 'beach',
    label: 'Beach Getaway',
    emoji: '🏖️',
    tagline: 'Coastal retreats, water sports & sunset events',
    gradientCard: 'from-sky-50 via-cyan-50 to-blue-50',
    gradientOverlay: 'from-sky-400/20 via-cyan-300/10 to-blue-400/20',
    iconRing: 'ring-sky-200 bg-sky-100',
    accent: 'text-sky-600',
    pill: 'bg-sky-100 text-sky-600 ring-sky-200',
    glow: 'hover:shadow-sky-200/70',
  },
  {
    slug: 'food',
    label: 'Food Festival',
    emoji: '🍽️',
    tagline: 'Culinary tastings, chef pop-ups & street food',
    gradientCard: 'from-amber-50 via-orange-50 to-yellow-50',
    gradientOverlay: 'from-amber-400/20 via-orange-300/10 to-yellow-400/20',
    iconRing: 'ring-amber-200 bg-amber-100',
    accent: 'text-amber-600',
    pill: 'bg-amber-100 text-amber-600 ring-amber-200',
    glow: 'hover:shadow-amber-200/70',
  },
  {
    slug: 'art',
    label: 'Art Exhibition',
    emoji: '🎨',
    tagline: 'Galleries, installations & live art performances',
    gradientCard: 'from-pink-50 via-rose-50 to-fuchsia-50',
    gradientOverlay: 'from-pink-400/20 via-rose-300/10 to-fuchsia-400/20',
    iconRing: 'ring-pink-200 bg-pink-100',
    accent: 'text-pink-600',
    pill: 'bg-pink-100 text-pink-600 ring-pink-200',
    glow: 'hover:shadow-pink-200/70',
  },
];

type EventItem = {
  id: string;
  name: string;
  type: string;
  date: string;
  description: string;
};

const eventsByCategory: Record<string, EventItem[]> = {
  music: [
    {
      id: '1',
      name: 'Jazz Night',
      type: 'Jazz',
      date: 'April 18, 2026',
      description:
        'An intimate evening of smooth jazz featuring top local and international artists at a cozy downtown venue.',
    },
    {
      id: '2',
      name: 'Rock Festival',
      type: 'Rock',
      date: 'May 10–12, 2026',
      description:
        'Three days of electrifying rock performances across multiple stages in the heart of the city.',
    },
    {
      id: '3',
      name: 'Classical Orchestra',
      type: 'Classical',
      date: 'April 30, 2026',
      description:
        'A grand symphony performance by the National Orchestra featuring works by Beethoven and Brahms.',
    },
  ],
  hiking: [
    {
      id: '1',
      name: 'Rila Mountain',
      type: 'Hiking',
      date: 'April 20–22, 2026',
      description:
        "A guided 3-day hike through Bulgaria's highest mountain range, ending at the iconic Seven Rila Lakes.",
    },
    {
      id: '2',
      name: 'Pirin Mountain',
      type: 'Trekking',
      date: 'May 5–7, 2026',
      description:
        'An immersive trekking experience through Pirin National Park with breathtaking alpine scenery.',
    },
    {
      id: '3',
      name: 'Vitosha Mountain',
      type: 'Day Hike',
      date: 'April 25, 2026',
      description:
        "A refreshing day hike on Vitosha's trails — Sofia's natural park — with sweeping panoramic city views.",
    },
  ],
  beach: [
    {
      id: '1',
      name: 'Sunny Beach Weekend',
      type: 'Coastal Retreat',
      date: 'May 15–17, 2026',
      description:
        'A relaxing coastal escape with beach volleyball, paddleboarding, and evening bonfires by the shore.',
    },
    {
      id: '2',
      name: 'Sunset Sailing',
      type: 'Water Sport',
      date: 'April 26, 2026',
      description:
        'Sail along the coast at golden hour aboard a private yacht with a gourmet dinner included.',
    },
    {
      id: '3',
      name: 'Surf & Yoga Retreat',
      type: 'Wellness',
      date: 'June 1–3, 2026',
      description:
        'Combine morning yoga sessions on the shore with afternoon surf lessons for all skill levels.',
    },
  ],
  food: [
    {
      id: '1',
      name: 'Street Food Carnival',
      type: 'Street Food',
      date: 'April 19, 2026',
      description:
        'Explore dozens of street food stalls featuring cuisines from around the world in one vibrant space.',
    },
    {
      id: '2',
      name: 'Farm-to-Table Dinner',
      type: 'Fine Dining',
      date: 'May 3, 2026',
      description:
        'An exclusive 5-course dinner by renowned chefs using locally sourced, seasonal ingredients.',
    },
    {
      id: '3',
      name: 'Wine & Cheese Festival',
      type: 'Tasting',
      date: 'May 23–24, 2026',
      description:
        'Discover premium wine and artisan cheese pairings with guided tastings from expert sommeliers.',
    },
  ],
  art: [
    {
      id: '1',
      name: 'Modern Art Showcase',
      type: 'Gallery',
      date: 'April 22, 2026',
      description:
        'A curated collection of contemporary works from emerging and established artists across five galleries.',
    },
    {
      id: '2',
      name: 'Live Mural Painting',
      type: 'Live Art',
      date: 'May 8, 2026',
      description:
        'Watch acclaimed muralists transform a blank canvas into a masterpiece over a single 8-hour session.',
    },
    {
      id: '3',
      name: 'Sculpture Garden Walk',
      type: 'Installation',
      date: 'May 17–18, 2026',
      description:
        'Stroll through an outdoor garden featuring large-scale sculptures and immersive art installations.',
    },
  ],
};

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

            {/* Decorative circle */}
            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/20 transition-transform duration-500 group-hover:scale-125" />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/15 transition-transform duration-500 group-hover:scale-110" />

            {/* Content */}
            <div className="relative p-8">
              {/* Icon */}
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

              {/* Text */}
              <h2 className="mt-5 text-xl font-semibold text-gray-900">{cat.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{cat.tagline}</p>

              {/* CTA row */}
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
  const events = eventsByCategory[slug] ?? [];

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
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500">
          {events.length} events
        </span>
      </div>

      {/* Event cards */}
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

                {/* Footer CTA */}
                <div
                  className={[
                    'mt-6 flex items-center gap-1 text-sm font-semibold transition-colors duration-200',
                    cat.accent,
                  ].join(' ')}
                >
                  <Link to="/auth" className="focus-visible:outline-none focus-visible:underline">
                    Reserve a spot
                  </Link>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

const Event = () => {
  const { category } = useParams<{ category?: string }>();
  return category ? <CategoryPage slug={category} /> : <CategoriesPage />;
};

export default Event;
