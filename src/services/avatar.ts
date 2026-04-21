import { supabase } from './supabase';

const BUCKET = 'avatars';

/**
 * Returns the public URL of a user's avatar, or null if none uploaded yet.
 * Files are stored at avatars/<userId>/avatar.<ext>
 */
export async function fetchAvatarUrl(userId: string): Promise<string | null> {
  const { data } = await supabase.storage
    .from(BUCKET)
    .list(userId, { limit: 1, search: 'avatar' });

  if (!data || data.length === 0) return null;

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(`${userId}/${data[0].name}`);

  // Bust cache so the new image shows immediately after upload
  return `${urlData.publicUrl}?t=${data[0].updated_at ?? data[0].created_at}`;
}

/**
 * Uploads a new avatar for the current user.
 * Always overwrites the previous file (upsert).
 * Returns the public URL of the uploaded image.
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}
