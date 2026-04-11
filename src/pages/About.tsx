const team = [
  { name: 'Maya Reyes', role: 'Founder & CEO', bio: 'Leader in live experiences and event technology with a passion for premium guest journeys.' },
  { name: 'Jordan Lee', role: 'Head of Product', bio: 'Builds intuitive workflows that make planning fast and collaborative for teams.' },
  { name: 'Avery Patel', role: 'Creative Director', bio: 'Shapes bold event branding and immersive campaigns for every audience.' },
];

const About = () => {
  return (
    <section className="bg-slate-950 px-6 py-16 sm:px-8 lg:px-10 xl:px-12">
      <div className="mx-auto max-w-6xl space-y-16">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-soft sm:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">About Event Book</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">We empower teams to create memorable events with confidence and care.</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">Our platform blends smart scheduling, guest management, and design-forward planning tools so every event feels polished from start to finish.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-8 text-slate-100 ring-1 ring-white/5 sm:p-10">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Our mission</p>
              <p className="mt-5 text-lg leading-8 text-slate-300">To simplify event planning by giving people a single, modern workspace for coordination, collaboration, and execution.</p>
              <div className="mt-8 grid gap-4 text-slate-200 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/90 p-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Vision</p>
                  <p className="mt-2 text-sm text-slate-300">Events that delight every attendee, every time.</p>
                </div>
                <div className="rounded-3xl bg-slate-900/90 p-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Values</p>
                  <p className="mt-2 text-sm text-slate-300">Clarity, collaboration, and creativity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Meet our team</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Experienced leaders behind every event experience.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {team.map((member) => (
              <article key={member.name} className="rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-soft transition hover:-translate-y-1">
                <div className="mb-5 h-14 w-14 rounded-2xl bg-indigo-500/10 p-3 text-indigo-300">👤</div>
                <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-indigo-300">{member.role}</p>
                <p className="mt-4 text-slate-400">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
