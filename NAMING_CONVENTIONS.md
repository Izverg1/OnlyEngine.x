# OnlyEngine.x Naming Conventions

## IMPORTANT: All OnlyEngine.x assets MUST use the `oe_` prefix

This document defines the naming conventions for the OnlyEngine.x platform. **These conventions are mandatory and must be followed for all new code and database objects.**

## Database Naming Conventions

### Tables
All tables MUST be prefixed with `oe_`:
- ✅ `oe_users` - User profiles
- ✅ `oe_content` - Generated content
- ✅ `oe_schedules` - Scheduling data
- ✅ `oe_analytics` - Analytics data
- ✅ `oe_workflows` - Workflow definitions
- ✅ `oe_platforms` - Platform integrations
- ✅ `oe_templates` - Content templates
- ✅ `oe_transactions` - Credit transactions
- ✅ `oe_notifications` - User notifications
- ❌ `users` - WRONG! Must be `oe_users`
- ❌ `profiles` - WRONG! Must be `oe_users`

### Functions
All database functions MUST be prefixed with `oe_`:
- ✅ `oe_update_updated_at_column()`
- ✅ `oe_calculate_credits()`
- ✅ `oe_validate_content()`
- ❌ `update_timestamp()` - WRONG! Must be `oe_update_timestamp()`

### Indexes
All indexes MUST be prefixed with `idx_oe_`:
- ✅ `idx_oe_users_email`
- ✅ `idx_oe_content_user_id`
- ❌ `idx_users_email` - WRONG! Must be `idx_oe_users_email`

### Triggers
All triggers MUST be prefixed with appropriate table name:
- ✅ `update_oe_users_updated_at`
- ✅ `validate_oe_content_before_insert`
- ❌ `update_users` - WRONG! Must include `oe_` prefix

## API Naming Conventions

### Endpoints
All API endpoints should follow RESTful conventions:
- ✅ `/api/oe/users` - User management
- ✅ `/api/oe/content` - Content operations
- ✅ `/api/oe/analytics` - Analytics data
- ✅ `/api/oe/auth/login` - Authentication
- ❌ `/api/users` - WRONG! Must include `/oe/` namespace

### Response Fields
API responses should use consistent field names:
```json
{
  "success": true,
  "data": {
    "oe_user_id": "uuid",
    "oe_content_id": "uuid",
    "oe_credits_remaining": 10
  },
  "metadata": {
    "oe_request_id": "uuid",
    "oe_timestamp": "2025-09-04T00:00:00Z"
  }
}
```

## Frontend Naming Conventions

### Component Names
React components for OnlyEngine.x features:
- ✅ `OEDashboard` - Main dashboard
- ✅ `OEContentGenerator` - Content generation
- ✅ `OEAnalytics` - Analytics view
- ✅ `OEUserProfile` - User profile
- ❌ `Dashboard` - Too generic! Use `OEDashboard`

### State/Store Keys
Redux/Context state keys:
- ✅ `oeUser` - Current user state
- ✅ `oeContent` - Content state
- ✅ `oeSettings` - App settings
- ❌ `user` - Too generic! Use `oeUser`

### CSS Classes
CSS classes for OnlyEngine.x specific styles:
- ✅ `.oe-dashboard`
- ✅ `.oe-content-card`
- ✅ `.oe-button-primary`
- ❌ `.dashboard` - Too generic! Use `.oe-dashboard`

## File Naming Conventions

### Configuration Files
- ✅ `oe.config.js` - Main config
- ✅ `oe.env` - Environment variables
- ✅ `oe-settings.json` - Settings file
- ❌ `config.js` - Too generic! Use `oe.config.js`

### Environment Variables
All environment variables MUST be prefixed with `OE_`:
- ✅ `OE_DATABASE_URL`
- ✅ `OE_API_KEY`
- ✅ `OE_SUPABASE_URL`
- ✅ `OE_OLLAMA_URL`
- ❌ `DATABASE_URL` - WRONG! Use `OE_DATABASE_URL`
- ❌ `NEXT_PUBLIC_API_URL` - Should be `NEXT_PUBLIC_OE_API_URL`

### Docker/Container Names
- ✅ `oe-frontend`
- ✅ `oe-backend`
- ✅ `oe-database`
- ✅ `oe-ai-engine`
- ❌ `frontend` - Too generic! Use `oe-frontend`

## Code Conventions

### Python (Backend)
```python
# ✅ Correct
class OEContentGenerator:
    def oe_generate_content(self):
        pass

OE_MAX_RETRIES = 3
OE_DEFAULT_QUALITY = "high"

# ❌ Wrong
class ContentGenerator:  # Missing OE prefix
    def generate(self):  # Missing oe_ prefix
        pass
```

### TypeScript/JavaScript (Frontend)
```typescript
// ✅ Correct
interface OEUser {
  oeUserId: string;
  oeCredits: number;
}

const OE_API_BASE = '/api/oe';
const oeGenerateContent = () => {};

// ❌ Wrong
interface User {  // Missing OE prefix
  userId: string;  // Missing oe prefix
}
```

## Migration Strategy

When migrating existing code:
1. Create new objects with `oe_` prefix
2. Update all references in code
3. Migrate data from old tables to new
4. Drop old objects only after verification

## Enforcement

- **Code Reviews**: All PRs must follow these conventions
- **Linting**: Automated checks for naming conventions
- **Documentation**: Update this file for any new patterns

## Quick Reference

| Category | Prefix/Format | Example |
|----------|--------------|---------|
| DB Tables | `oe_` | `oe_users` |
| DB Functions | `oe_` | `oe_calculate_credits()` |
| DB Indexes | `idx_oe_` | `idx_oe_users_email` |
| API Endpoints | `/api/oe/` | `/api/oe/content` |
| React Components | `OE` | `OEDashboard` |
| CSS Classes | `.oe-` | `.oe-button` |
| Env Variables | `OE_` | `OE_DATABASE_URL` |
| Docker Containers | `oe-` | `oe-backend` |
| Python Classes | `OE` | `OEContentGenerator` |
| JS/TS Interfaces | `OE` | `OEUser` |
| State Keys | `oe` | `oeUser` |

## Why This Matters

1. **Namespace Isolation**: Prevents conflicts with other systems
2. **Clear Ownership**: Immediately identifies OnlyEngine.x assets
3. **Searchability**: Easy to find all OE-related code
4. **Professionalism**: Shows attention to detail
5. **Scalability**: Prevents naming conflicts as system grows

---

**Remember**: When in doubt, add the `oe_` or `OE` prefix!

Last Updated: 2025-09-04
Version: 1.0.0