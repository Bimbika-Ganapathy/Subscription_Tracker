import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      trackers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          category: string;
          frequency: 'Monthly' | 'Yearly' | 'Custom';
          due_date: string;
          notes: string | null;
          icon: string;
          color: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          amount: number;
          category: string;
          frequency: 'Monthly' | 'Yearly' | 'Custom';
          due_date: string;
          notes?: string | null;
          icon?: string;
          color?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          amount?: number;
          category?: string;
          frequency?: 'Monthly' | 'Yearly' | 'Custom';
          due_date?: string;
          notes?: string | null;
          icon?: string;
          color?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};