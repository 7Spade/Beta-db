/**
 * @fileoverview Supabase Client-Side SDK Initialization
 * @description This file initializes the Supabase client for client-side operations.
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/supabase.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key are required.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
