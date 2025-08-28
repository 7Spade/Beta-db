/**
 * @fileoverview Supabase Server-Side SDK Initialization
 * @description This file initializes the Supabase client for server-side operations using the service role key.
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/supabase.types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and service role key are required for server-side operations.');
}

// Create a supabase client for server-side operations with service role
export const supabaseServer = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
