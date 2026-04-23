import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { categories } from '../services/categories';
import { type EventItem, fetchEventById, fetchJoinedEventIds, joinEvent } from '../services/events';
import {
  type ChatMessage,
  fetchMessages,
  postMessage,
  deleteMessage,
  toggleReaction,
  subscribeToMessages,
} from '../services/messages';

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

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
      <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.712Z" clipRule="evenodd" />
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

function Avatar({
  initials,
  avatarUrl,
  size = 'md',
}: {
  initials: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md';
}) {
  const dim = size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm';

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={initials}
        className={`inline-flex shrink-0 rounded-full object-cover ${dim}`}
      />
    );
  }

  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${dim} ${avatarColor(initials)}`}>
      {initials}
    </span>
  );
}

// ─── Reaction bar ─────────────────────────────────────────────────────────────

const FIXED_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

// ─── Message bubble ───────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((todayStart.getTime() - msgStart.getTime()) / 86_400_000);

  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (diffDays === 0) return time;
  if (diffDays === 1) return `Yesterday ${time}`;
  if (diffDays < 7) return `${diffDays} days ago ${time}`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + time;
}

function MessageBubble({
  msg,
  onDelete,
  onToggleReaction,
  onError,
}: {
  msg: ChatMessage;
  onDelete: (id: string) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onError: (err: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteMessage(msg.id);
      onDelete(msg.id);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to delete message.');
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleReaction(emoji: string) {
    await toggleReaction(msg.id, emoji);
    onToggleReaction(msg.id, emoji);
  }

  const myReaction = msg.reactions.find((r) => r.reactedByMe)?.emoji ?? null;

  // ── Deleted placeholder ─────────────────────────────────────────────────

  if (msg.deleted) {
    return (
      <div className={`flex items-end gap-2 ${msg.isOwn ? 'justify-end' : ''}`}>
        {!msg.isOwn && <Avatar initials={msg.initials} avatarUrl={msg.avatarUrl} size="sm" />}
        <span className="rounded-2xl border border-dashed border-gray-200 px-4 py-2 text-xs italic text-gray-400">
          Message deleted
        </span>
        {msg.isOwn && <Avatar initials={msg.initials} avatarUrl={msg.avatarUrl} size="sm" />}
      </div>
    );
  }

  // ── Own message ─────────────────────────────────────────────────────────

  if (msg.isOwn) {
    return (
      <div className="flex items-start justify-end gap-2">
        <div className="flex max-w-[75%] flex-col items-end gap-1">
          <div className="group/msg relative flex flex-col items-end gap-1">
            <span className="gradient-iris rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm">
              {msg.text}
            </span>
            {/* Delete button — appears on hover */}
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Delete message"
              className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover/msg:opacity-100 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-400 shadow hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
            >
              {deleting ? (
                <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : <TrashIcon />}
            </button>
          </div>
          <span className="text-xs text-gray-400">{formatTime(msg.createdAt)}</span>
        </div>
        <Avatar initials={msg.initials} avatarUrl={msg.avatarUrl} size="sm" />
      </div>
    );
  }

  // ── Others' message ─────────────────────────────────────────────────────

  return (
    <div className="group/bubble flex items-start gap-2">
      <Avatar initials={msg.initials} avatarUrl={msg.avatarUrl} size="sm" />
      <div className="flex max-w-[75%] flex-col gap-1">
        <span className="ml-1 text-xs font-medium text-gray-500">{msg.username}</span>

        {/* Bubble + hover reaction strip */}
        <div className="relative">
          <span className="block rounded-2xl rounded-bl-sm bg-white/80 px-4 py-2.5 text-sm leading-relaxed text-gray-800 shadow-sm ring-1 ring-gray-100 backdrop-blur-sm">
            {msg.text}
          </span>

          {/* Floating emoji strip — appears above bubble on hover */}
          <div className="absolute -top-11 left-0 z-10 flex items-center gap-0.5 rounded-2xl border border-gray-100 bg-white px-2 py-1.5 shadow-lg opacity-0 transition-all duration-150 group-hover/bubble:opacity-100 pointer-events-none group-hover/bubble:pointer-events-auto">
            {FIXED_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleToggleReaction(emoji)}
                title={emoji}
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full text-lg transition-all duration-100 hover:scale-125',
                  myReaction === emoji ? 'bg-violet-100 scale-110' : 'hover:bg-gray-100',
                ].join(' ')}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reaction counts — overlapping the bottom edge of the bubble */}
          {msg.reactions.length > 0 && (
            <div className="absolute -bottom-3.5 left-2 flex flex-wrap gap-1">
              {msg.reactions.map((r) => (
                <button
                  key={r.emoji}
                  onClick={() => handleToggleReaction(r.emoji)}
                  className={[
                    'inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-xs font-medium shadow-sm transition-all duration-150',
                    r.reactedByMe
                      ? 'border-violet-300 bg-violet-50 text-violet-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-violet-200 hover:bg-violet-50',
                  ].join(' ')}
                >
                  <span>{r.emoji}</span>
                  <span>{r.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Spacer so reaction badges don't overlap the timestamp */}
        {msg.reactions.length > 0 && <div className="h-3" />}

        <span className="ml-1 text-xs text-gray-400">{formatTime(msg.createdAt)}</span>
      </div>
    </div>
  );
}

// ─── Reserve gate ─────────────────────────────────────────────────────────────

function ReserveGate({ event, cat, category, onJoined }: {
  event: EventItem;
  cat: NonNullable<ReturnType<typeof categories.find>>;
  category: string;
  onJoined: () => void;
}) {
  const [joining, setJoining] = useState(false);

  async function handleJoin() {
    setJoining(true);
    try {
      await joinEvent(event.id);
      onJoined();
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-6 py-20 text-center sm:px-8">
      <div className={[
        'flex h-24 w-24 items-center justify-center rounded-3xl text-5xl',
        'bg-gradient-to-br shadow-lg ring-1',
        cat.gradientCard,
        cat.iconRing,
      ].join(' ')}>
        {cat.emoji}
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Reserve your spot first</h2>
        <p className="text-base leading-relaxed text-gray-500">
          The conversation for{' '}
          <span className="font-semibold text-gray-700">{event.name}</span>{' '}
          is only open to attendees. Reserve your spot to unlock the chat and connect with others going.
        </p>
      </div>

      <div className={[
        'flex w-full items-center gap-4 rounded-2xl bg-gradient-to-br p-5',
        cat.gradientCard,
        'border border-white/60 shadow-sm',
      ].join(' ')}>
        <span className={['flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ring-1', cat.iconRing].join(' ')}>
          💬
        </span>
        <div className="min-w-0 text-left">
          <p className="text-sm font-semibold text-gray-800">Join the conversation</p>
          <p className="text-xs leading-relaxed text-gray-500">
            {event.date}{event.location ? ` · ${event.location}` : ''}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        <button
          onClick={handleJoin}
          disabled={joining}
          className="gradient-iris flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-200 transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {joining ? (
            <>
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Reserving…
            </>
          ) : 'Reserve a spot & enter chat'}
        </button>
        <Link
          to={`/events/${category}`}
          className="rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-500 shadow-sm transition hover:border-violet-300 hover:text-violet-600"
        >
          Back to {cat.label}
        </Link>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Conversation() {
  const { category = '', eventId = '' } = useParams<{ category: string; eventId: string }>();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [hasReserved, setHasReserved] = useState<boolean | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Load event + reservation check ────────────────────────────────────────

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoadingEvent(true);
    setHasReserved(null);

    Promise.all([
      fetchEventById(eventId),
      fetchJoinedEventIds(),
    ]).then(([data, joinedIds]) => {
      if (cancelled) return;
      setEvent(data);
      setHasReserved(joinedIds.has(eventId));
      setLoadingEvent(false);
    });

    return () => { cancelled = true; };
  }, [eventId, user]);

  // ── Load messages + subscribe to realtime ─────────────────────────────────

  useEffect(() => {
    if (!hasReserved || !user) return;
    let cancelled = false;

    setMessagesLoading(true);
    fetchMessages(eventId).then((data) => {
      if (cancelled) return;
      setMessages(data);
      setMessagesLoading(false);
    });

    const unsub = subscribeToMessages(
      eventId,
      user.id,
      // onInsert
      (msg) => {
        if (cancelled) return;
        setMessages((prev) => [...prev, msg]);
      },
      // onDelete
      (messageId) => {
        if (cancelled) return;
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, deleted: true } : m)),
        );
      },
      // onReaction
      (messageId, reactions) => {
        if (cancelled) return;
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, reactions } : m)),
        );
      },
    );

    return () => {
      cancelled = true;
      unsub();
    };
  }, [eventId, hasReserved, user]);

  // ── Auto-scroll to bottom ─────────────────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Message action handlers ───────────────────────────────────────────────

  function handleMessageDeleted(id: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, deleted: true } : m)),
    );
  }

  function handleReactionToggled(messageId: string, _emoji: string) {
    // Reaction state is updated via realtime; nothing to do optimistically
    // to avoid double-update. Realtime will fire and update.
    void messageId;
  }

  // ── Send ──────────────────────────────────────────────────────────────────

  async function handleSend() {
    const text = draft.trim();
    if (!text || sending) return;

    setSendError(null);
    setSending(true);
    setDraft('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const msg = await postMessage(eventId, text);
      setMessages((prev) => [...prev, msg]);
    } catch {
      setSendError('Failed to send. Please try again.');
      setDraft(text);
    } finally {
      setSending(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const cat = event ? categories.find((c) => c.label === event.category) : null;

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loadingEvent || hasReserved === null) {
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

  // ── Not reserved ──────────────────────────────────────────────────────────

  if (!hasReserved) {
    return (
      <ReserveGate
        event={event}
        cat={cat}
        category={category}
        onJoined={() => setHasReserved(true)}
      />
    );
  }

  // ── Current user's avatar for input area ──────────────────────────────────

  const currentUserMsg = messages.find((m) => m.isOwn);
  const inputAvatarUrl = currentUserMsg?.avatarUrl ?? null;
  const inputInitials = currentUserMsg?.initials ?? (user?.email?.slice(0, 2).toUpperCase() ?? 'Me');

  // ── Chat UI ───────────────────────────────────────────────────────────────

  return (
    <section className="mx-auto flex max-w-7xl flex-col px-6 pb-12 pt-14 sm:px-8">

      {/* Breadcrumb */}
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
            className={['inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl ring-1', cat.iconRing].join(' ')}
            aria-hidden="true"
          >
            {cat.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${cat.pill}`}>
              {event.type}
            </span>
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

      {/* Chat panel */}
      <div className="mt-6 flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-lg backdrop-blur-sm">

        {/* Panel header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <UsersIcon className={`h-5 w-5 ${cat.accent}`} />
            <span className="font-semibold text-gray-900">Event conversation</span>
            {!messagesLoading && (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                {messages.length} {messages.length === 1 ? 'message' : 'messages'}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Live
          </span>
        </div>

        {/* Messages */}
        <div className="flex min-h-[420px] flex-col gap-4 overflow-y-auto px-6 py-6 md:min-h-[520px]">
          {messagesLoading ? (
            <div className="my-auto flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-violet-100 border-t-violet-500" />
            </div>
          ) : messages.length === 0 ? (
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
              <MessageBubble
                key={msg.id}
                msg={msg}
                onDelete={handleMessageDeleted}
                onToggleReaction={handleReactionToggled}
                onError={setSendError}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Send error */}
        {sendError && (
          <div className="mx-4 mb-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-xs text-red-600">
            {sendError}
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="flex items-end gap-3">
            <Avatar initials={inputInitials} avatarUrl={inputAvatarUrl} size="sm" />
            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKey}
                placeholder={`Message about ${event.name}…`}
                rows={1}
                disabled={sending}
                className={[
                  'w-full resize-none rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 pr-12',
                  'text-sm leading-relaxed text-gray-900 placeholder:text-gray-400',
                  'shadow-sm backdrop-blur-sm transition-all duration-200',
                  'focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100',
                  'disabled:opacity-60',
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
                disabled={!draft.trim() || sending}
                aria-label="Send message"
                className={[
                  'absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-xl',
                  'gradient-iris text-white shadow-sm transition-all duration-200',
                  'hover:scale-105 active:scale-95',
                  'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100',
                ].join(' ')}
              >
                {sending ? (
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : <SendIcon />}
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
