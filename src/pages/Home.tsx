import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Custom Event Pages',
    description: 'Create polished event listings, agendas, and guest details with fast page building tools.',
    icon: '✦',
    color: 'bg-violet-100 text-violet-500',
  },
  {
    title: 'Live RSVP Tracking',
    description: 'Monitor attendance, dietary preferences, and guest check-ins in one dashboard.',
    icon: '◈',
    color: 'bg-sky-100 text-sky-500',
  },
  {
    title: 'Team Collaboration',
    description: 'Coordinate vendors, schedules, and creative teams using simple project workflows.',
    icon: '◎',
    color: 'bg-pink-100 text-pink-500',
  },
];

const Home = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:px-8 lg:pt-20">

        {/* Hero */}
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-600">
              <span className="gradient-iris inline-block h-2 w-2 rounded-full" />
              Tailored event planning for modern teams
            </span>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Build unforgettable events and keep{' '}
                <span className="gradient-iris-text">every detail</span> in one place.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-gray-500">
                Event Book makes it effortless to launch experiences, manage attendees, and collaborate with your entire event crew.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#features"
                className="gradient-iris inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:opacity-90 active:scale-95"
              >
                Explore features
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-7 py-3 text-sm font-semibold text-gray-700 transition hover:border-violet-300 hover:text-violet-600"
              >
                Contact sales
              </Link>
            </div>
          </div>

          {/* Stats card */}
          <div className="glass rounded-[2rem] p-8 sm:p-10">
            <div className="space-y-6">
              <div className="glass-dark rounded-3xl p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Event Book Dashboard</p>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">Stay aligned at every stage</h2>
                <p className="mt-2 text-sm text-gray-500">Collect RSVPs, assign tasks, and share progress with your entire event team from a single hub.</p>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="glass-dark rounded-3xl p-5">
                  <dt className="text-xs text-gray-400">Attendees</dt>
                  <dd className="mt-2 text-3xl font-semibold">
                    <span className="gradient-iris-text">1.2k</span>
                  </dd>
                </div>
                <div className="glass-dark rounded-3xl p-5">
                  <dt className="text-xs text-gray-400">Events</dt>
                  <dd className="mt-2 text-3xl font-semibold">
                    <span className="gradient-iris-text">24+</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mt-28">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Feature highlights</p>
            <h2 className="mt-4 text-3xl font-semibold text-gray-900 sm:text-4xl">Everything you need for high-impact events.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">From launch planning to day-of coordination, Event Book gives you the tools to manage events with clarity and speed.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="glass group rounded-3xl p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100"
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-lg ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-3 text-sm text-gray-500">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>

        {/* CTA band */}
        <div className="gradient-iris-subtle mt-24 overflow-hidden rounded-[2rem] p-10 text-center sm:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Get started today</p>
          <h2 className="mt-3 text-2xl font-semibold text-gray-900 sm:text-3xl">Ready to plan your next unforgettable event?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">Join thousands of event teams already using Event Book to deliver seamless experiences.</p>
          <Link
            to="/auth"
            className="gradient-iris mt-7 inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:opacity-90 active:scale-95"
          >
            Start for free
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
