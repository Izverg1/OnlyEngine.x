# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL: Naming Convention Requirements

**ALL OnlyEngine.x database tables, functions, and assets MUST use the `oe_` prefix.**

Examples:
- Tables: `oe_users`, `oe_content`, `oe_analytics`  
- Functions: `oe_update_timestamp()`, `oe_calculate_credits()`
- API endpoints: `/api/oe/content`, `/api/oe/users`
- Environment vars: `OE_DATABASE_URL`, `OE_API_KEY`

See `NAMING_CONVENTIONS.md` for complete details. **This is MANDATORY for all new code.**

## Project Overview

OnlyEngine.x is an AI-powered content generation and distribution platform with a dual-server architecture. The platform uses real AI services (Ollama with Mistral) for prompt enhancement and content analysis, Supabase for database management, and a local file storage system.

## Architecture

### Dual Backend System
- **main.py** (port 8000): Mock API server for initial testing
- **real_main.py** (port 8001): Production API with real integrations (Ollama, Supabase, file storage)

The real backend connects to:
- Ollama (port 11434) for LLM operations using Mistral model
- Supabase local (port 54321 API, 54323 Studio) for database
- Local file storage at `/Users/izverg/projects/OnlyEngine.ai/storage/`

### Service Dependencies
All services must be running for full functionality:
1. Ollama must be started first (`ollama serve`)
2. Supabase local must be initialized (`supabase start`)
3. Frontend and backend servers depend on these services

## Common Development Commands

### Starting the Full Stack

```bash
# Terminal 1: Start Ollama (if not running)
ollama serve

# Terminal 2: Start Supabase local
supabase start

# Terminal 3: Start Frontend (port 3001)
cd creative-agency-portfolio
npm run dev

# Terminal 4: Start Real Backend (port 8001)
cd backend
python real_main.py
```

### Frontend Development
```bash
cd creative-agency-portfolio
npm install --legacy-peer-deps  # Required due to React 19 peer deps
npm run dev                      # Start dev server
npm run build                    # Production build
npm run lint                     # Run linter
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt    # Install dependencies
python real_main.py                # Start real backend with integrations
uvicorn main:app --reload          # Start mock backend (testing only)
```

### Database Management
```bash
supabase start                     # Start local Supabase
supabase stop                      # Stop Supabase
supabase db reset                  # Reset database and apply migrations
supabase migration new <name>      # Create new migration
```

### AI Model Management
```bash
ollama pull mistral                # Download Mistral model
ollama run mistral "prompt"        # Test Mistral directly
ollama list                        # List installed models
```

## Key Integration Points

### Ollama Integration (`backend/ollama_integration.py`)
- **OllamaClient**: Main client for LLM operations
- **PromptEnhancer**: Enhances prompts with style-specific improvements
- **ContentModerationAI**: Checks content for policy violations
- Uses Mistral model for all operations
- Expects Ollama running on localhost:11434

### Supabase Configuration
- Local credentials are hardcoded in `real_main.py`
- Database schema in `supabase/migrations/20250904_initial_schema.sql`
- RLS is disabled for local development
- Tables: profiles, content, schedules, analytics, workflows

### File Storage System
- Storage root: `/Users/izverg/projects/OnlyEngine.ai/storage/`
- Subdirectories: `generated/` and `uploads/`
- Files served via FastAPI static mount at `/storage/*`

## Environment Variables

Frontend (`.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-from-supabase-start>
FASTAPI_URL=http://localhost:8001
```

Backend uses hardcoded local values for development.

## Testing API Endpoints

```bash
# Test Ollama connection
curl http://localhost:8001/api/test-ollama

# Create user
curl -X POST http://localhost:8001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "name": "Test User"}'

# Generate content (requires user_id from signup)
curl -X POST http://localhost:8001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Your prompt", "style": "photorealistic", "user_id": "<user-id>"}'
```

## Important Architecture Decisions

### Why Two Backend Files?
- `main.py`: Original mock implementation for UI testing
- `real_main.py`: Production implementation with actual service integrations
- This allows testing UI without dependencies and gradual migration to real services

### Local-First Development
- All services run locally (no cloud dependencies for core functionality)
- Supabase local provides full PostgreSQL database
- Ollama provides LLM capabilities without API keys
- File storage uses local filesystem

### Frontend Structure
The frontend is in `creative-agency-portfolio/` (legacy name from template) and uses:
- Next.js 15 with App Router
- Shadcn UI components in `components/ui/`
- Supabase client for database operations
- Direct API calls to backend (no tRPC/GraphQL)

## Current Limitations & Workarounds

1. **No Real Image Generation**: Currently creates text placeholder files instead of images. ComfyUI integration prepared but not connected.

2. **Platform APIs**: OnlyFans/Fansly/FeetFinder integrations are stubbed but not functional (would require real API keys).

3. **Authentication**: Simplified auth without JWT validation. Real auth would use Supabase Auth or similar.

4. **React 19 Compatibility**: Using `--legacy-peer-deps` for npm install due to dependency conflicts.

## Debugging Common Issues

- **Port conflicts**: Frontend may use 3001 if 3000 is busy
- **Supabase errors**: Run `supabase stop --all` then `supabase start` to reset
- **Ollama not responding**: Ensure `ollama serve` is running and Mistral model is pulled
- **Database migrations failing**: Check migration order in `supabase/migrations/`