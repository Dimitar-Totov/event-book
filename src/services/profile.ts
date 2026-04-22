import { supabase } from './supabase';

/**
 * Saves or updates the username for the given user.
 * Uses upsert so it works for both first-time creation and updates.
 */
export async function saveUsername(userId: string, username: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, username: username.trim() });

  if (error) throw new Error(error.message);
}

/**
 * Fetches the username for a given user ID.
 * Returns null if no profile exists yet.
 */
export async function fetchUsername(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return null;
  return data.username as string;
}
