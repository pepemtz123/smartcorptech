import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Show warning if Supabase not configured
if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn('⚠️ Supabase not configured. Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  city_state: string;
  project_type: string;
  timeline: string | null;
  glass_size: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
  source: 'quote_form' | 'manual' | 'google_sheet';
  google_sheet_row_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface FollowUp {
  id: string;
  lead_id: string;
  note: string;
  follow_up_date: string;
  completed: boolean;
  created_at: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  display_order: number;
  created_at: string;
}
