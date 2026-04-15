const team = [
  { name: 'Maya Reyes', role: 'Founder & CEO', bio: 'Leader in live experiences and event technology with a passion for premium guest journeys.', color: 'bg-violet-100 text-violet-500' },
  { name: 'Jordan Lee', role: 'Head of Product', bio: 'Builds intuitive workflows that make planning fast and collaborative for teams.', color: 'bg-sky-100 text-sky-500' },
  { name: 'Avery Patel', role: 'Creative Director', bio: 'Shapes bold event branding and immersive campaigns for every audience.', color: 'bg-pink-100 text-pink-500' },
];

const About = () => {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-10 xl:px-12">
      <div className="mx-auto max-w-6xl space-y-20">

        {/* Hero card */}
        <div className="glass rounded-[2rem] p-10 sm:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">About Event Book</p>
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                We empower teams to create{' '}
                <span className="gradient-iris-text">memorable events</span>{' '}
                with confidence and care.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-gray-500">
                Our platform blends smart scheduling, guest management, and design-forward planning tools so every event feels polished from start to finish.
              </p>
            </div>

            <div className="glass-dark rounded-3xl p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Our mission</p>
              <p className="mt-5 text-base leading-8 text-gray-600">
                To simplify event planning by giving people a single, modern workspace for coordination, collaboration, and execution.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-violet-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Vision</p>
                  <p className="mt-2 text-sm text-gray-600">Events that delight every attendee, every time.</p>
                </div>
                <div className="rounded-2xl bg-sky-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">Values</p>
                  <p className="mt-2 text-sm text-gray-600">Clarity, collaboration, and creativity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="space-y-10">
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Meet our team</p>
            <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">Experienced leaders behind every event experience.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {team.map((member) => (
              <article
                key={member.name}
                className="glass group rounded-3xl p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100"
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${member.color}`}>👤</div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-500">{member.role}</p>
                <p className="mt-4 text-sm text-gray-500">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="gradient-iris-subtle grid gap-6 rounded-[2rem] p-10 text-center sm:grid-cols-3 sm:p-12">
          {[
            { value: '24+', label: 'Events Hosted', accent: 'text-violet-600' },
            { value: '1.2k', label: 'Happy Attendees', accent: 'text-sky-600' },
            { value: '98%', label: 'Satisfaction Rate', accent: 'text-pink-600' },
          ].map(({ value, label, accent }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className={`text-4xl font-bold ${accent}`}>{value}</span>
              <span className="text-sm text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
