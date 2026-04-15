const Contact = () => {
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

        {/* Form */}
        <form className="glass rounded-[2rem] p-10 sm:p-14" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Send a message</p>
              <h2 className="mt-2 text-xl font-semibold text-gray-900">We'd love to hear from you</h2>
            </div>

            {[
              { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
              { id: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id}>
                <label className="block text-sm font-medium text-gray-700" htmlFor={id}>{label}</label>
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none ring-violet-400 transition focus:border-violet-400 focus:ring-2"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell us about your event needs"
                className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none ring-violet-400 transition focus:border-violet-400 focus:ring-2"
              />
            </div>

            <button
              type="submit"
              className="gradient-iris w-full rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:opacity-90 active:scale-95"
            >
              Send message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
