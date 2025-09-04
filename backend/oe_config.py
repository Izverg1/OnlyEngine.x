"""
OnlyEngine Configuration
All configuration for the OnlyEngine.x platform
"""

import os
from pathlib import Path

# Database Configuration - Using OnlyEngine database
OE_DATABASE_URL = os.getenv("OE_DATABASE_URL", "postgresql://postgres:postgres@127.0.0.1:54322/onlyengine")
OE_DATABASE_NAME = "onlyengine"
OE_DATABASE_HOST = "127.0.0.1"
OE_DATABASE_PORT = 54322

# Supabase Configuration  
OE_SUPABASE_URL = os.getenv("OE_SUPABASE_URL", "http://127.0.0.1:54321")
OE_SUPABASE_ANON_KEY = os.getenv(
    "OE_SUPABASE_ANON_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
)
OE_SUPABASE_SERVICE_KEY = os.getenv(
    "OE_SUPABASE_SERVICE_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
)

# API Configuration
OE_API_HOST = "0.0.0.0"
OE_API_PORT = 8001
OE_API_VERSION = "2.1.0"

# AI Services
OE_OLLAMA_URL = os.getenv("OE_OLLAMA_URL", "http://localhost:11434")
OE_COMFYUI_URL = os.getenv("OE_COMFYUI_URL", "http://localhost:8188")

# Storage Configuration
OE_STORAGE_BASE = Path("/Users/izverg/projects/OnlyEngine.ai/storage")
OE_STORAGE_BASE.mkdir(exist_ok=True)
(OE_STORAGE_BASE / "generated").mkdir(exist_ok=True)
(OE_STORAGE_BASE / "uploads").mkdir(exist_ok=True)
(OE_STORAGE_BASE / "temp").mkdir(exist_ok=True)

# Table Names (all with oe_ prefix)
class OETables:
    USERS = "oe_users"
    CONTENT = "oe_content"
    SCHEDULES = "oe_schedules"
    ANALYTICS = "oe_analytics"
    WORKFLOWS = "oe_workflows"
    PLATFORMS = "oe_platforms"
    TEMPLATES = "oe_templates"
    TRANSACTIONS = "oe_transactions"
    NOTIFICATIONS = "oe_notifications"

# Platform Settings
OE_DEFAULT_CREDITS = 10
OE_MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB
OE_ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.mp4', '.webm'}

# Security
OE_JWT_SECRET = os.getenv("OE_JWT_SECRET", "your-secret-key-change-in-production")
OE_JWT_ALGORITHM = "HS256"
OE_JWT_EXPIRY_HOURS = 24