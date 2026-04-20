import { supabase } from './supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Raw row shape returned by Supabase */
interface EventRow {
  id: string;
  name: string;
  category: string;
  type: string | null;
  description: string | null;
  date_start: string;   // ISO date string e.g. "2026-04-18"
  date_end: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

/** Normalised shape used throughout the UI */
export type EventItem = {
  id: string;
  name: string;
  type: string;
  date: string;          // formatted display string e.g. "April 18, 2026"
  date_start: string;
  date_end: string | null;
  description: string;
  location: string | null;
  category: string;      // full label e.g. "Music Concerts"
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts ISO date strings to a human-readable display string.
 *   single-day  → "April 18, 2026"
 *   same-month  → "May 10–12, 2026"
 *   cross-month → "April 30 – May 2, 2026"
 */
function formatEventDate(dateStart: string, dateEnd: string | null): string {
  const start = new Date(`${dateStart}T00:00:00`);

  if (!dateEnd) {
    return start.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const end = new Date(`${dateEnd}T00:00:00`);
  const year = start.getFullYear();
  const startMonth = start.toLocaleDateString('en-US', { month: 'long' });

  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${startMonth} ${start.getDate()}–${end.getDate()}, ${year}`;
  }

  const endMonth = end.toLocaleDateString('en-US', { month: 'long' });
  return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${year}`;
}

function mapRow(row: EventRow): EventItem {
  return {
    id: row.id,
    name: row.name,
    type: row.type ?? row.category,
    date: formatEventDate(row.date_start, row.date_end),
    date_start: row.date_start,
    date_end: row.date_end,
    description: row.description ?? '',
    location: row.location,
    category: row.category,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Fetch all events belonging to a category (matched by full label).
 * Results are ordered by start date ascending.
 */
export async function fetchEventsByCategory(categoryLabel: string): Promise<EventItem[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('category', categoryLabel)
    .order('date_start', { ascending: true });

  if (error) throw new Error(error.message);
  return (data as EventRow[]).map(mapRow);
}

/**
 * Fetch a single event by its UUID.
 * Returns null if not found or on error.
 */
export async function fetchEventById(id: string): Promise<EventItem | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return mapRow(data as EventRow);
}
