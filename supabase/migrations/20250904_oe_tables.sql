-- OnlyEngine.x Database Schema
-- All tables use 'oe_' prefix for proper namespace isolation
-- Author: OnlyEngine.x Team
-- Date: 2025-09-04

-- Drop old tables if they exist (migration from old schema)
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS workflows CASCADE;
DROP TABLE IF EXISTS content CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- OE_USERS: User profiles and authentication
-- ============================================
CREATE TABLE IF NOT EXISTS oe_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE, -- Links to Supabase Auth
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'professional', 'enterprise')),
  credits_remaining INTEGER DEFAULT 10,
  credits_used INTEGER DEFAULT 0,
  total_generated INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OE_CONTENT: Generated content storage
-- ============================================
CREATE TABLE IF NOT EXISTS oe_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES oe_users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'text', 'audio', 'hybrid')),
  title TEXT,
  description TEXT,
  prompt TEXT NOT NULL,
  enhanced_prompt TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  style TEXT DEFAULT 'default',
  quality TEXT DEFAULT 'standard' CHECK (quality IN ('draft', 'standard', 'high', 'ultra')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'archived')),
  generation_time_ms INTEGER,
  file_size_bytes BIGINT,
  dimensions JSONB, -- {width, height, duration, etc}
  ai_model TEXT,
  ai_params JSONB,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  is_nsfw BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OE_SCHEDULES: Content scheduling
-- ============================================
CREATE TABLE IF NOT EXISTS oe_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES oe_content(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES oe_users(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMPTZ NOT NULL,
  platforms TEXT[] DEFAULT '{}',
  platform_configs JSONB DEFAULT '{}', -- Platform-specific settings
  target_segments TEXT[] DEFAULT '{}',
  target_params JSONB DEFAULT '{}',
  caption TEXT,
  hashtags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'processing', 'published', 'failed', 'cancelled')),
  published_at TIMESTAMPTZ,
  publish_results JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OE_ANALYTICS: Performance tracking
-- ============================================
CREATE TABLE IF NOT EXISTS oe_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES oe_content(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES oe_users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5, 2),
  revenue_cents INTEGER DEFAULT 0,
  data JSONB DEFAULT '{}',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OE_WORKFLOWS: Automation workflows
-- ============================================
CREATE TABLE IF NOT EXISTS oe_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES oe_users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'custom',
  trigger_type TEXT CHECK (trigger_type IN ('manual', 'scheduled', 'event', 'webhook')),
  trigger_config JSONB DEFAULT '{}',
  steps JSONB NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'failed')),
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  run_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  results JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OE_PLATFORMS: Platform integrations
-- ============================================
CREATE TABLE IF NOT EXISTS oe_platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES oe_users(id) ON DELETE CASCADE,
  platform_name TEXT NOT NULL,
  platform_user_id TEXT,
  platform_username TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  credentials JSONB DEFAULT '{}', -- Encrypted credentials
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform_name)
);

-- ============================================
-- OE_TEMPLATES: Content templates
-- ============================================
CREATE TABLE IF NOT EXISTS oe_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES oe_users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  category TEXT,
  prompt_template TEXT,
  style_presets JSONB DEFAULT '{}',
  ai_params JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OE_TRANSACTIONS: Credit transactions
-- ============================================
CREATE TABLE IF NOT EXISTS oe_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES oe_users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'refund', 'bonus', 'subscription')),
  amount INTEGER NOT NULL,
  balance_after INTEGER,
  description TEXT,
  reference_id UUID, -- Can reference content, subscription, etc.
  reference_type TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OE_NOTIFICATIONS: User notifications
-- ============================================
CREATE TABLE IF NOT EXISTS oe_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES oe_users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_oe_users_email ON oe_users(email);
CREATE INDEX idx_oe_users_auth_id ON oe_users(auth_id);
CREATE INDEX idx_oe_content_user_id ON oe_content(user_id);
CREATE INDEX idx_oe_content_status ON oe_content(status);
CREATE INDEX idx_oe_content_created_at ON oe_content(created_at DESC);
CREATE INDEX idx_oe_schedules_user_id ON oe_schedules(user_id);
CREATE INDEX idx_oe_schedules_scheduled_for ON oe_schedules(scheduled_for);
CREATE INDEX idx_oe_analytics_content_id ON oe_analytics(content_id);
CREATE INDEX idx_oe_analytics_user_id ON oe_analytics(user_id);
CREATE INDEX idx_oe_workflows_user_id ON oe_workflows(user_id);
CREATE INDEX idx_oe_platforms_user_id ON oe_platforms(user_id);
CREATE INDEX idx_oe_templates_user_id ON oe_templates(user_id);
CREATE INDEX idx_oe_transactions_user_id ON oe_transactions(user_id);
CREATE INDEX idx_oe_notifications_user_id ON oe_notifications(user_id, is_read);

-- ============================================
-- TRIGGERS for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION oe_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_oe_users_updated_at BEFORE UPDATE ON oe_users
  FOR EACH ROW EXECUTE FUNCTION oe_update_updated_at_column();

CREATE TRIGGER update_oe_content_updated_at BEFORE UPDATE ON oe_content
  FOR EACH ROW EXECUTE FUNCTION oe_update_updated_at_column();

CREATE TRIGGER update_oe_schedules_updated_at BEFORE UPDATE ON oe_schedules
  FOR EACH ROW EXECUTE FUNCTION oe_update_updated_at_column();

CREATE TRIGGER update_oe_workflows_updated_at BEFORE UPDATE ON oe_workflows
  FOR EACH ROW EXECUTE FUNCTION oe_update_updated_at_column();

CREATE TRIGGER update_oe_platforms_updated_at BEFORE UPDATE ON oe_platforms
  FOR EACH ROW EXECUTE FUNCTION oe_update_updated_at_column();

CREATE TRIGGER update_oe_templates_updated_at BEFORE UPDATE ON oe_templates
  FOR EACH ROW EXECUTE FUNCTION oe_update_updated_at_column();

-- ============================================
-- SEED DATA: Default test user
-- ============================================
INSERT INTO oe_users (id, auth_id, email, username, display_name, subscription_tier, credits_remaining)
VALUES (
  '2b8b38b2-2cfd-4976-a92a-01bf202fc744'::uuid,
  'ff4a198b-d744-48c5-b91c-affc5ec2447a'::uuid,
  'test@example.com',
  'testuser',
  'Test User',
  'free',
  10
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- COMMENTS for documentation
-- ============================================
COMMENT ON TABLE oe_users IS 'OnlyEngine.x user profiles and account information';
COMMENT ON TABLE oe_content IS 'Generated content storage with metadata';
COMMENT ON TABLE oe_schedules IS 'Content scheduling and distribution queue';
COMMENT ON TABLE oe_analytics IS 'Performance metrics and analytics data';
COMMENT ON TABLE oe_workflows IS 'Automation workflows and pipelines';
COMMENT ON TABLE oe_platforms IS 'Third-party platform integrations';
COMMENT ON TABLE oe_templates IS 'Reusable content generation templates';
COMMENT ON TABLE oe_transactions IS 'Credit and billing transactions';
COMMENT ON TABLE oe_notifications IS 'User notification system';

-- Grant permissions (for production, implement RLS)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;