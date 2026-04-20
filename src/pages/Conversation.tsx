import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { categories } from '../services/categories';
import { type EventItem, fetchEventById } from '../services/events';

// ─── Seed messages (keyed by event name) ─────────────────────────────────────

type Message = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  isOwn?: boolean;
};

const seedMessages: Record<string, Message[]> = {
  'Jazz Night': [
    { id: 'm1', author: 'Lena Fischer',  avatar: 'LF', text: "Can't wait for Jazz Night! Anyone else planning to arrive early?", timestamp: '2:14 PM' },
    { id: 'm2', author: 'Marco Bianchi', avatar: 'MB', text: "Yes! Doors open at 7 so I'll be there around 6:45 to grab a good seat.", timestamp: '2:17 PM' },
    { id: 'm3', author: 'Sofia Herrera', avatar: 'SH', text: 'Is parking easy near the venue?', timestamp: '2:21 PM' },
    { id: 'm4', author: 'Marco Bianchi', avatar: 'MB', text: "There's a public lot two blocks east — about $8 for the evening.", timestamp: '2:23 PM' },
  ],
  'Rock Festival': [
    { id: 'm1', author: 'Jordan Lee', avatar: 'JL', text: 'Rock Festival day one lineup just dropped. Main stage kicks off at 4 PM!', timestamp: '11:05 AM' },
    { id: 'm2', author: 'Priya Nair',  avatar: 'PN', text: 'Which bands are you most excited about?', timestamp: '11:09 AM' },
    { id: 'm3', author: 'Jordan Lee', avatar: 'JL', text: 'Definitely the headliner on Saturday night. The pyrotechnics alone are worth it.', timestamp: '11:12 AM' },
  ],
  'Classical Orchestra': [
    { id: 'm1', author: 'Elena Vasquez', avatar: 'EV', text: "The Classical Orchestra performance is tomorrow — has anyone listened to the programme?", timestamp: '4:30 PM' },
    { id: 'm2', author: 'Theo Müller',   avatar: 'TM', text: "Beethoven's 9th is on the setlist. That finale is going to be incredible.", timestamp: '4:35 PM' },
  ],
  'Rila Mountain': [
    { id: 'm1', author: 'Ivan Petrov', avatar: 'IP', text: "Rila hike crew, who's bringing trekking poles? Trail to the lakes can be slippery in April.", timestamp: '9:00 AM' },
    { id: 'm2', author: 'Ana Costa',   avatar: 'AC', text: 'I have a spare pair if anyone needs to borrow!', timestamp: '9:04 AM' },
    { id: 'm3', author: 'Yuki Tanaka', avatar: 'YT', text: 'What about weather? Forecast looks a bit cloudy for day two.', timestamp: '9:08 AM' },
    { id: 'm4', author: 'Ivan Petrov', avatar: 'IP', text: 'Pack a light rain jacket just in case. The mountain weather changes fast.', timestamp: '9:11 AM' },
  ],
  'Pirin Mountain': [
    { id: 'm1', author: 'Bogdan Iliescu', avatar: 'BI', text: "Pirin trek starts at Predela pass, right? Anyone driving from Sofia and has a free seat?", timestamp: '3:00 PM' },
    { id: 'm2', author: 'Marta Kowalski', avatar: 'MK', text: 'I have one seat free — leaving Saturday at 6 AM from NDK.', timestamp: '3:05 PM' },
  ],
  'Vitosha Mountain': [
    { id: 'm1', author: 'Alex Dimitrov', avatar: 'AD', text: "Vitosha day hike — are we taking the Aleko route or going through Zlatni Mostove?", timestamp: '10:00 AM' },
    { id: 'm2', author: 'Sara Patel',    avatar: 'SP', text: 'Zlatni Mostove has the river rocks which are super scenic this time of year!', timestamp: '10:03 AM' },
    { id: 'm3', author: 'Alex Dimitrov', avatar: 'AD', text: "Great call, let's do that route then.", timestamp: '10:06 AM' },
  ],
  'Sunny Beach Weekend': [
    { id: 'm1', author: 'Nadia Rousseau', avatar: 'NR', text: "Sunny Beach crew — anyone know if paddleboards are included or extra cost?", timestamp: '1:00 PM' },
    { id: 'm2', author: 'Carlos Ortiz',   avatar: 'CO', text: 'I checked — paddleboards are included with the registration!', timestamp: '1:04 PM' },
    { id: 'm3', author: 'Nadia Rousseau', avatar: 'NR', text: "Amazing, that's such a great deal. See you all there!", timestamp: '1:06 PM' },
  ],
  'Sunset Sailing': [
    { id: 'm1', author: 'Thomas Eriksson', avatar: 'TE', text: 'Sunset Sailing — dress code? Is smart casual appropriate?', timestamp: '5:00 PM' },
    { id: 'm2', author: 'Lila Moreau',     avatar: 'LM', text: 'The invite said "resort elegant" — so think flowy dresses and linen shirts.', timestamp: '5:05 PM' },
    { id: 'm3', author: 'Thomas Eriksson', avatar: 'TE', text: 'Perfect, thanks! The gourmet dinner menu looks incredible too.', timestamp: '5:07 PM' },
  ],
  'Surf & Yoga Retreat': [
    { id: 'm1', author: 'Kai Nakamura', avatar: 'KN', text: "Surf & Yoga Retreat — what skill level is the surfing part? Total beginner here!", timestamp: '8:00 AM' },
    { id: 'm2', author: 'Maya Santos',  avatar: 'MS', text: 'Instructors cover all levels. I was a complete novice last year and it was amazing.', timestamp: '8:05 AM' },
  ],
  'Street Food Carnival': [
    { id: 'm1', author: 'Amara Diallo',  avatar: 'AD', text: "Street Food Carnival — which country's cuisine are you most excited to try?", timestamp: '12:00 PM' },
    { id: 'm2', author: 'Ren Chen',      avatar: 'RC', text: "Hoping for a great Thai stall. Last year's pad thai was unforgettable.", timestamp: '12:03 PM' },
    { id: 'm3', author: 'Amara Diallo',  avatar: 'AD', text: 'Ethiopian injera for me! Fingers crossed it\'s there again.', timestamp: '12:05 PM' },
    { id: 'm4', author: 'Lucas Ferreira',avatar: 'LF', text: 'They also confirmed a Brazilian churrasco grill this year!', timestamp: '12:08 PM' },
  ],
  'Farm-to-Table Dinner': [
    { id: 'm1', author: 'Charlotte Dubois', avatar: 'CD', text: "Farm-to-Table Dinner — does anyone know if vegetarian options are available for all 5 courses?", timestamp: '6:00 PM' },
    { id: 'm2', author: 'Ethan Brooks',     avatar: 'EB', text: 'Yes! I emailed the organiser and they confirmed a full vegetarian tasting menu.', timestamp: '6:04 PM' },
    { id: 'm3', author: 'Charlotte Dubois', avatar: 'CD', text: "That's wonderful, thank you!", timestamp: '6:06 PM' },
  ],
  'Wine & Cheese Festival': [
    { id: 'm1', author: 'Valentina Greco', avatar: 'VG', text: 'Wine & Cheese Festival — do tickets include unlimited tastings or is it per pour?', timestamp: '3:30 PM' },
    { id: 'm2', author: 'Oliver Schmitt',  avatar: 'OS', text: 'Tickets include 6 wine pours and 4 cheese selections. Extra tokens are $5 each.', timestamp: '3:34 PM' },
  ],
  'Modern Art Showcase': [
    { id: 'm1', author: 'Isabelle Laurent', avatar: 'IL', text: 'Modern Art Showcase — the preview images look stunning. Any favourites already?', timestamp: '11:00 AM' },
    { id: 'm2', author: 'Hana Yoshida',     avatar: 'HY', text: "Room 3 — the large-scale canvas work. Photos don't do it justice apparently.", timestamp: '11:04 AM' },
    { id: 'm3', author: 'Isabelle Laurent', avatar: 'IL', text: 'Definitely putting that first on my list. Guided tour or self-explore?', timestamp: '11:07 AM' },
    { id: 'm4', author: 'Hana Yoshida',     avatar: 'HY', text: "There's a guided tour at 2 PM and 5 PM, or you can go at your own pace.", timestamp: '11:09 AM' },
  ],
  'Live Mural Painting': [
    { id: 'm1', author: 'Damien Rousseau', avatar: 'DR', text: 'Live Mural Painting — will there be a chance to meet the artists afterwards?', timestamp: '2:00 PM' },
    { id: 'm2', author: 'Zoe Andersen',    avatar: 'ZA', text: "Yes! There's a meet & greet with light refreshments at 6 PM once the mural wraps.", timestamp: '2:04 PM' },
  ],
  'Sculpture Garden Walk': [
    { id: 'm1', author: 'Finn Larsson', avatar: 'FL', text: 'Sculpture Garden Walk — is the path accessible for wheelchairs and pushchairs?', timestamp: '9:30 AM' },
    { id: 'm2', author: 'Cleo Baptiste', avatar: 'CB', text: 'The main paths are paved and fully accessible. Some of the side trails are gravel though.', timestamp: '9:35 AM' },
    { id: 'm3', author: 'Finn Larsson', avatar: 'FL', text: 'Good to know, thanks! The main path will be perfect.', timestamp: '9:37 AM' },
  ],
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.288Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="h-4 w-4 shrink-0">
      <path fillRule="evenodd" d="M4 1.75a.75.75 0 0 1 1.5 0V3h5V1.75a.75.75 0 0 1 1.5 0V3A2 2 0 0 1 14 5v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2V1.75ZM4.5 7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7Z" clipRule="evenodd" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5">
      <path fillRule="evenodd" d="M14 8a.75.75 0 0 1-.75.75H4.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L4.56 7.25H13.25A.75.75 0 0 1 14 8Z" clipRule="evenodd" />
    </svg>
  );
}

function UsersIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
    </svg>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

const avatarPalette = [
  'bg-violet-100 text-violet-700',
  'bg-teal-100 text-teal-700',
  'bg-sky-100 text-sky-700',
  'bg-amber-100 text-amber-700',
  'bg-pink-100 text-pink-700',
  'bg-emerald-100 text-emerald-700',
  'bg-orange-100 text-orange-700',
  'bg-fuchsia-100 text-fuchsia-700',
];

function avatarColor(initials: string) {
  const code = initials.charCodeAt(0) + (initials.charCodeAt(1) ?? 0);
  return avatarPalette[code % avatarPalette.length];
}

function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm';
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${dim} ${avatarColor(initials)}`}>
      {initials}
    </span>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, isOwn }: { msg: Message; isOwn: boolean }) {
  if (isOwn) {
    return (
      <div className="flex items-end justify-end gap-2">
        <div className="flex max-w-[75%] flex-col items-end gap-1">
          <span className="gradient-iris rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm">
            {msg.text}
          </span>
          <span className="text-xs text-gray-400">{msg.timestamp}</span>
        </div>
        <Avatar initials="You" size="sm" />
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <Avatar initials={msg.avatar} size="sm" />
      <div className="flex max-w-[75%] flex-col gap-1">
        <span className="ml-1 text-xs font-medium text-gray-500">{msg.author}</span>
        <span className="rounded-2xl rounded-bl-sm bg-white/80 px-4 py-2.5 text-sm leading-relaxed text-gray-800 shadow-sm ring-1 ring-gray-100 backdrop-blur-sm">
          {msg.text}
        </span>
        <span className="ml-1 text-xs text-gray-400">{msg.timestamp}</span>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Conversation() {
  const { category = '', eventId = '' } = useParams<{ category: string; eventId: string }>();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load event from Supabase by UUID, then seed messages by event name
  useEffect(() => {
    let cancelled = false;
    setLoadingEvent(true);

    fetchEventById(eventId).then((data) => {
      if (cancelled) return;
      setEvent(data);
      setMessages(data ? (seedMessages[data.name] ?? []) : []);
      setLoadingEvent(false);
    });

    return () => { cancelled = true; };
  }, [eventId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const cat = event ? categories.find((c) => c.label === event.category) : null;

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, author: 'You', avatar: 'Yo', text, timestamp, isOwn: true },
    ]);
    setDraft('');
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────

  if (loadingEvent) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-28 text-center sm:px-8">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-violet-100 border-t-violet-500" />
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────

  if (!event || !cat) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-28 text-center sm:px-8">
        <p className="text-lg font-semibold text-gray-900">Event not found.</p>
        <Link to="/events" className="mt-3 inline-block text-sm font-semibold text-violet-500 hover:underline">
          Back to all categories
        </Link>
      </div>
    );
  }

  // ── Layout ────────────────────────────────────────────────────────────────

  return (
    <section className="mx-auto flex max-w-7xl flex-col px-6 pb-12 pt-14 sm:px-8">

      {/* Breadcrumb nav */}
      <nav className="flex items-center gap-2 text-sm">
        <Link
          to="/events"
          className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 font-medium text-gray-500 shadow-sm transition-all duration-200 hover:border-violet-300 hover:text-violet-600"
        >
          <BackIcon />
          Events
        </Link>
        <span className="text-gray-300">/</span>
        <Link
          to={`/events/${category}`}
          className={`font-medium transition-colors duration-200 hover:underline ${cat.accent}`}
        >
          {cat.label}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="truncate font-medium text-gray-700">{event.name}</span>
      </nav>

      {/* Event summary card */}
      <div className={[
        'mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-br p-7',
        cat.gradientCard,
        'border border-white/60 shadow-lg',
      ].join(' ')}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <span
            className={[
              'inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl ring-1',
              cat.iconRing,
            ].join(' ')}
            aria-hidden="true"
          >
            {cat.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${cat.pill}`}>
                {event.type}
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              {event.name}
            </h1>
            <div className={`mt-1.5 flex items-center gap-2 text-sm ${cat.accent}`}>
              <CalendarIcon />
              <time>{event.date}</time>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{event.description}</p>
          </div>
        </div>
      </div>

      {/* Conversations panel */}
      <div className="mt-6 flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-lg backdrop-blur-sm">

        {/* Panel header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <UsersIcon className={`h-5 w-5 ${cat.accent}`} />
            <span className="font-semibold text-gray-900">Event conversation</span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
              {messages.length} messages
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Live
          </span>
        </div>

        {/* Messages list */}
        <div className="flex min-h-[420px] flex-col gap-4 overflow-y-auto px-6 py-6 md:min-h-[520px]">
          {messages.length === 0 ? (
            <div className="my-auto flex flex-col items-center justify-center gap-3 text-center">
              <span className={['inline-flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ring-1', cat.iconRing].join(' ')}>
                {cat.emoji}
              </span>
              <p className="font-semibold text-gray-700">No messages yet</p>
              <p className="max-w-xs text-sm text-gray-400">
                Be the first to start the conversation for{' '}
                <span className="font-medium text-gray-600">{event.name}</span>!
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} isOwn={!!msg.isOwn} />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="flex items-end gap-3">
            <Avatar initials="Yo" size="sm" />
            <div className="relative flex-1">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKey}
                placeholder={`Message about ${event.name}…`}
                rows={1}
                className={[
                  'w-full resize-none rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 pr-12',
                  'text-sm leading-relaxed text-gray-900 placeholder:text-gray-400',
                  'shadow-sm backdrop-blur-sm transition-all duration-200',
                  'focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100',
                ].join(' ')}
                style={{ maxHeight: '120px', overflowY: 'auto' }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                }}
              />
              <button
                onClick={handleSend}
                disabled={!draft.trim()}
                aria-label="Send message"
                className={[
                  'absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-xl',
                  'gradient-iris text-white shadow-sm transition-all duration-200',
                  'hover:scale-105 active:scale-95',
                  'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100',
                ].join(' ')}
              >
                <SendIcon />
              </button>
            </div>
          </div>
          <p className="mt-2 pl-12 text-xs text-gray-400">
            Press <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-px text-xs">Enter</kbd> to send &middot;{' '}
            <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-px text-xs">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </section>
  );
}
