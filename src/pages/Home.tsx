import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Custom Event Pages',
    description: 'Create polished event listings, agendas, and guest details with fast page building tools.',
  },
  {
    title: 'Live RSVP Tracking',
    description: 'Monitor attendance, dietary preferences, and guest check-ins in one dashboard.',
  },
  {
    title: 'Team Collaboration',
    description: 'Coordinate vendors, schedules, and creative teams using simple project workflows.',
  },
];

const Home = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 sm:px-8 lg:pt-16">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <p className="inline-flex rounded-full bg-indigo-500/15 px-4 py-1 text-sm font-medium text-indigo-200">
              Tailored event planning for modern teams
            </p>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Build unforgettable events and keep every detail in one place.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Event Book makes it effortless to launch experiences, manage attendees, and collaborate with your entire event crew.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="#features" className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-400">
                Explore features
              </a>
              <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 px-6 py-3 text-base font-semibold text-slate-100 transition hover:border-slate-500 hover:text-white">
                Contact sales
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft sm:p-10">
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-950/80 p-6 text-slate-100 shadow-xl ring-1 ring-white/5 sm:p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Event Book Dashboard</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Stay aligned at every stage</h2>
                <p className="mt-3 text-slate-400">Collect RSVPs, assign tasks, and share progress with your entire event team from a single hub.</p>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                  <dt className="text-sm text-slate-400">Attendees</dt>
                  <dd className="mt-2 text-3xl font-semibold text-white">1.2k</dd>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                  <dt className="text-sm text-slate-400">Events</dt>
                  <dd className="mt-2 text-3xl font-semibold text-white">24+</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div id="features" className="mt-20">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Feature highlights</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Everything you need for high-impact events.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">From launch planning to day-of coordination, Event Book gives you the tools to manage events with clarity and speed.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-indigo-500/30">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                  <span className="text-xl">★</span>
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-slate-400">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
