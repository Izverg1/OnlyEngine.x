import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  name?: string
  subscription_tier: 'free' | 'basic' | 'pro' | 'enterprise'
  credits_remaining: number
  total_generated: number
  created_at: string
  updated_at: string
}

export interface Content {
  id: string
  user_id: string
  prompt: string
  image_url?: string
  style: string
  quality: 'standard' | 'high' | 'ultra'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  metadata?: any
  created_at: string
  updated_at: string
}