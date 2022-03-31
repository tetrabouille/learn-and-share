import { createClient, SupabaseClient } from '@supabase/supabase-js';

const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = import.meta.env;

if (VITE_SUPABASE_URL == null || VITE_SUPABASE_ANON_KEY == null) {
  throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set');
}
const supabaseUrl = VITE_SUPABASE_URL as string;
const supabaseAnonKey = VITE_SUPABASE_ANON_KEY as string;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
