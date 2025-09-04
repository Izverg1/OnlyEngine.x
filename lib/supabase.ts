import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Content {
  id: string
  user_id: string
  prompt: string
  image_url: string
  style: string
  quality: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Schedule {
  id: string
  content_id: string
  user_id: string
  scheduled_for: string
  platforms: string[]
  target_segments: string[]
  status: 'scheduled' | 'processing' | 'completed' | 'cancelled'
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  subscription_tier: 'free' | 'basic' | 'pro' | 'enterprise'
  credits_remaining: number
  total_generated: number
  created_at: string
  updated_at: string
}

// Helper functions
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data as UserProfile
}

export async function getRecentContent(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data as Content[]
}

export async function createContent(content: Partial<Content>) {
  const { data, error } = await supabase
    .from('content')
    .insert(content)
    .select()
    .single()
  
  if (error) throw error
  return data as Content
}

export async function updateContent(id: string, updates: Partial<Content>) {
  const { data, error } = await supabase
    .from('content')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Content
}

export async function getScheduledPosts(userId: string) {
  const { data, error } = await supabase
    .from('schedules')
    .select('*, content(*)')
    .eq('user_id', userId)
    .eq('status', 'scheduled')
    .order('scheduled_for', { ascending: true })
  
  if (error) throw error
  return data
}

export async function createSchedule(schedule: Partial<Schedule>) {
  const { data, error } = await supabase
    .from('schedules')
    .insert(schedule)
    .select()
    .single()
  
  if (error) throw error
  return data as Schedule
}