import { supabase } from './supabase';

export interface ContactPayload {
  name: string;
  message: string;
}

/**
 * Saves a contact message for the currently authenticated user.
 * The recipient (sent_to) is fixed to example@abv.bg.
 */
export async function sendContactMessage(payload: ContactPayload): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) throw new Error('You must be signed in to send a message.');

  const { error } = await supabase.from('contact_messages').insert({
    user_id: user.id,
    email: user.email,
    name: payload.name.trim(),
    message: payload.message.trim(),
  });

  if (error) throw new Error(error.message);
}
