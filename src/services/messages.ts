import { supabase } from './supabase';
import { fetchUsername } from './profile';
import { fetchAvatarUrl } from './avatar';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Reaction {
  emoji: string;
  count: number;
  reactedByMe: boolean;
}

export interface ChatMessage {
  id: string;
  eventId: string;
  userId: string;
  username: string;
  initials: string;
  avatarUrl: string | null;
  text: string;
  createdAt: string;
  isOwn: boolean;
  deleted: boolean;
  reactions: Reaction[];
}

interface MessageRow {
  id: string;
  event_id: string;
  user_id: string;
  text: string;
  created_at: string;
  deleted_at: string | null;
}

interface ReactionRow {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toInitials(name: string): string {
  const parts = name.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function groupReactions(rows: ReactionRow[], currentUserId: string): Reaction[] {
  const map: Record<string, { count: number; reactedByMe: boolean }> = {};
  for (const r of rows) {
    if (!map[r.emoji]) map[r.emoji] = { count: 0, reactedByMe: false };
    map[r.emoji].count++;
    if (r.user_id === currentUserId) map[r.emoji].reactedByMe = true;
  }
  return Object.entries(map).map(([emoji, { count, reactedByMe }]) => ({ emoji, count, reactedByMe }));
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function fetchMessages(eventId: string): Promise<ChatMessage[]> {
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id ?? '';

  const { data: msgData } = await supabase
    .from('event_messages')
    .select('id, event_id, user_id, text, created_at, deleted_at')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });

  const messages = (msgData ?? []) as MessageRow[];

  // Fetch reactions for these message IDs
  let reactions: ReactionRow[] = [];
  if (messages.length > 0) {
    const ids = messages.map((m) => m.id);
    const { data: rxRows } = await supabase
      .from('message_reactions')
      .select('id, message_id, user_id, emoji')
      .in('message_id', ids);
    reactions = (rxRows ?? []) as ReactionRow[];
  }

  // Resolve unique user IDs → usernames + avatars in parallel
  const uniqueIds = [...new Set(messages.map((r) => r.user_id))];
  const nameMap: Record<string, string> = {};
  const avatarMap: Record<string, string | null> = {};
  await Promise.all(
    uniqueIds.map(async (uid) => {
      const [name, avatar] = await Promise.all([fetchUsername(uid), fetchAvatarUrl(uid)]);
      nameMap[uid] = name ?? uid.slice(0, 8);
      avatarMap[uid] = avatar;
    }),
  );

  // Group reactions by message_id
  const rxByMessage: Record<string, ReactionRow[]> = {};
  for (const rx of reactions) {
    if (!rxByMessage[rx.message_id]) rxByMessage[rx.message_id] = [];
    rxByMessage[rx.message_id].push(rx);
  }

  return messages.map((row) => {
    const displayName = nameMap[row.user_id] ?? row.user_id.slice(0, 8);
    return {
      id: row.id,
      eventId: row.event_id,
      userId: row.user_id,
      username: displayName,
      initials: toInitials(displayName),
      avatarUrl: avatarMap[row.user_id] ?? null,
      text: row.text,
      createdAt: row.created_at,
      isOwn: row.user_id === currentUserId,
      deleted: !!row.deleted_at,
      reactions: groupReactions(rxByMessage[row.id] ?? [], currentUserId),
    };
  });
}

// ─── Post ─────────────────────────────────────────────────────────────────────

export async function postMessage(eventId: string, text: string): Promise<ChatMessage> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be signed in.');

  const { data, error } = await supabase
    .from('event_messages')
    .insert({ event_id: eventId, user_id: user.id, text: text.trim() })
    .select('id, event_id, user_id, text, created_at, deleted_at')
    .single();

  if (error || !data) throw new Error(error?.message ?? 'Failed to send message.');

  const row = data as MessageRow;
  const [username, avatarUrl] = await Promise.all([
    fetchUsername(user.id).then((n) => n ?? user.email?.split('@')[0] ?? 'You'),
    fetchAvatarUrl(user.id),
  ]);

  return {
    id: row.id,
    eventId: row.event_id,
    userId: row.user_id,
    username,
    initials: toInitials(username),
    avatarUrl,
    text: row.text,
    createdAt: row.created_at,
    isOwn: true,
    deleted: false,
    reactions: [],
  };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteMessage(messageId: string): Promise<void> {
  const { error } = await supabase
    .from('event_messages')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', messageId);

  if (error) throw new Error(error.message);
}

// ─── Reactions ────────────────────────────────────────────────────────────────

export async function toggleReaction(messageId: string, emoji: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be signed in.');

  // Fetch any existing reaction this user has on this message (any emoji)
  const { data: existing } = await supabase
    .from('message_reactions')
    .select('id, emoji')
    .eq('message_id', messageId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    if (existing.emoji === emoji) {
      // Same emoji — remove (unreact)
      await supabase.from('message_reactions').delete().eq('id', existing.id);
    } else {
      // Different emoji — replace
      await supabase
        .from('message_reactions')
        .update({ emoji })
        .eq('id', existing.id);
    }
  } else {
    // No reaction yet — insert
    await supabase
      .from('message_reactions')
      .insert({ message_id: messageId, user_id: user.id, emoji });
  }
}

// ─── Realtime ─────────────────────────────────────────────────────────────────

export function subscribeToMessages(
  eventId: string,
  currentUserId: string,
  onInsert: (msg: ChatMessage) => void,
  onDelete: (messageId: string) => void,
  onReaction: (messageId: string, reactions: Reaction[]) => void,
): () => void {
  const channel = supabase.channel(`chat:${eventId}`);

  // New messages
  channel.on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'event_messages', filter: `event_id=eq.${eventId}` },
    async (payload) => {
      const row = payload.new as MessageRow;
      if (row.user_id === currentUserId) return; // own messages added optimistically
      const [username, avatarUrl] = await Promise.all([
        fetchUsername(row.user_id).then((n) => n ?? row.user_id.slice(0, 8)),
        fetchAvatarUrl(row.user_id),
      ]);
      onInsert({
        id: row.id,
        eventId: row.event_id,
        userId: row.user_id,
        username,
        initials: toInitials(username),
        avatarUrl,
        text: row.text,
        createdAt: row.created_at,
        isOwn: false,
        deleted: false,
        reactions: [],
      });
    },
  );

  // Soft-deleted messages
  channel.on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'event_messages', filter: `event_id=eq.${eventId}` },
    (payload) => {
      const row = payload.new as MessageRow;
      if (row.deleted_at) onDelete(row.id);
    },
  );

  // Reaction changes — refetch for that message
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'message_reactions' },
    async (payload) => {
      const row = (payload.new ?? payload.old) as ReactionRow;
      if (!row?.message_id) return;
      const { data } = await supabase
        .from('message_reactions')
        .select('id, message_id, user_id, emoji')
        .eq('message_id', row.message_id);
      const grouped = groupReactions((data ?? []) as ReactionRow[], currentUserId);
      onReaction(row.message_id, grouped);
    },
  );

  channel.subscribe();
  return () => { supabase.removeChannel(channel); };
}
