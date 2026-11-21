import { createClient } from '@supabase/supabase-js';

// Supabase configuration comes from environment variables only — no keys are
// hardcoded in source. The publishable key is safe to expose in the browser
// because Row Level Security and the narrow booking RPCs protect customer
// data, but it is still managed through the hosting dashboard, not the repo.
//
// Set these in Vercel (Project → Settings → Environment Variables) and in a
// local .env file for development. See .env.example.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your environment (see .env.example).',
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    // Anonymous visitors never sign in, so nothing is stored for them; the
    // persisted session only matters for Anna on the /admin page.
    persistSession: true,
    autoRefreshToken: true,
    // Needed for /set-password: the password-reset email returns a token in the
    // URL, and the client has to turn it into a session before we can use it.
    detectSessionInUrl: true,
  },
});
