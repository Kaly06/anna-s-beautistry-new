import { createClient } from '@supabase/supabase-js';

// These fallbacks are the public browser configuration for Anna's Beautistry.
// The publishable key is safe to expose in the browser because Row Level
// Security and the narrow booking RPCs protect customer data. Environment
// variables can override them for another Supabase project.
const fallbackSupabaseUrl = 'https://busrljzyzaalswqolqcw.supabase.co';
const fallbackSupabasePublishableKey = 'sb_publishable_VcTgcnHSVcNpx4XjB0MzwA_qSmy6MbG';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || fallbackSupabaseUrl;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || fallbackSupabasePublishableKey;

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    // Anonymous visitors never sign in, so nothing is stored for them; the
    // persisted session only matters for Anna on the /admin closures page.
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
