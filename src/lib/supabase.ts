import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'


export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      pets: {
        Row: {
          id: string
          user_id: string
          species: string
          level: number
          xp: number
          coins: number
          cosmetics: unknown[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          species: string
          level?: number
          xp?: number
          coins?: number
          cosmetics?: unknown[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          species?: string
          level?: number
          xp?: number
          coins?: number
          cosmetics?: unknown[]
          created_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          started_at: string
          ended_at: string | null
          planned_minutes: number
          effective_minutes: number
          unfocused_seconds: number
          status: 'active' | 'completed' | 'abandoned'
        }
        Insert: {
          id?: string
          user_id: string
          started_at: string
          ended_at?: string | null
          planned_minutes: number
          effective_minutes?: number
          unfocused_seconds?: number
          status?: 'active' | 'completed' | 'abandoned'
        }
        Update: {
          id?: string
          user_id?: string
          started_at?: string
          ended_at?: string | null
          planned_minutes?: number
          effective_minutes?: number
          unfocused_seconds?: number
          status?: 'active' | 'completed' | 'abandoned'
        }
      }
      xp_events: {
        Row: {
          id: string
          pet_id: string
          session_id: string | null
          amount: number
          reason: string
          created_at: string
        }
        Insert: {
          id?: string
          pet_id: string
          session_id?: string | null
          amount: number
          reason: string
          created_at?: string
        }
        Update: {
          id?: string
          pet_id?: string
          session_id?: string | null
          amount?: number
          reason?: string
          created_at?: string
        }
      }
      items: {
        Row: {
          id: string
          sku: string
          type: 'food' | 'cosmetic'
          name: string
          meta: Record<string, unknown>
        }
        Insert: {
          id?: string
          sku: string
          type: 'food' | 'cosmetic'
          name: string
          meta?: Record<string, unknown>
        }
        Update: {
          id?: string
          sku?: string
          type?: 'food' | 'cosmetic'
          name?: string
          meta?: Record<string, unknown>
        }
      }
      inventories: {
        Row: {
          user_id: string
          item_id: string
          qty: number
        }
        Insert: {
          user_id: string
          item_id: string
          qty?: number
        }
        Update: {
          user_id?: string
          item_id?: string
          qty?: number
        }
      }
    }
  }
}
