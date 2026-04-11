const Contact = () => {
  return (
    <section className="bg-slate-950 px-6 py-16 sm:px-8 lg:px-10 xl:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-8 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-soft sm:p-14">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Get in touch</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Questions, demos, or partnership inquiries.</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">Reach out and our team will help you build the ideal event experience for your next gathering.</p>
          </div>

          <div className="grid gap-5 rounded-3xl border border-slate-800 bg-slate-950/80 p-7 text-slate-100">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Address</p>
              <p className="mt-3 text-lg text-slate-300">198 Event Lane, Suite 210<br />Seattle, WA 98101</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Email</p>
              <a href="mailto:hello@eventbook.com" className="mt-3 inline-block text-lg text-white hover:text-indigo-300">hello@eventbook.com</a>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Phone</p>
              <p className="mt-3 text-lg text-slate-300">+1 (206) 555-0174</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90">
            <div className="h-72 w-full bg-slate-900">
              <iframe
                title="Event Book map"
                className="h-full w-full border-0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2689.909875176904!2d-122.34409068442055!3d47.60962457918469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54901545d9fcc9f7%3A0x6fd3fa06e8f31bf9!2sSeattle%2C%20WA%2098101!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <form className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-soft sm:p-14">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300" htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell us about your event needs"
                className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>
            <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-400">
              Send message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
