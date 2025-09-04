from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime
import asyncio
import os
from pathlib import Path
import base64
from supabase import create_client, Client
from ollama_integration import OllamaClient, PromptEnhancer, ContentModerationAI

# Initialize app
app = FastAPI(title="OnlyEngine.x API", version="2.0.0")

# Initialize services
ollama_client = OllamaClient()
prompt_enhancer = PromptEnhancer(ollama_client)
content_moderator = ContentModerationAI(ollama_client)

# Initialize Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL", "http://127.0.0.1:54321")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Create storage directory
STORAGE_PATH = Path("/Users/izverg/projects/OnlyEngine.ai/storage")
STORAGE_PATH.mkdir(exist_ok=True)
(STORAGE_PATH / "generated").mkdir(exist_ok=True)
(STORAGE_PATH / "uploads").mkdir(exist_ok=True)

# Mount static files
app.mount("/storage", StaticFiles(directory=str(STORAGE_PATH)), name="storage")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class GenerationRequest(BaseModel):
    prompt: str
    style: str = "photorealistic"
    quality: str = "standard"
    user_id: Optional[str] = None

class UserSignup(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "OnlyEngine.x API", "status": "online", "version": "2.0.0"}

@app.post("/api/auth/signup")
async def signup(user: UserSignup):
    """Create a new user account"""
    try:
        # Create user profile in Supabase
        profile = supabase.table("oe_users").insert({
            "email": user.email,
            "name": user.name or user.email.split("@")[0],
            "subscription_tier": "free",
            "credits_remaining": 10
        }).execute()
        
        return {
            "success": True,
            "user": profile.data[0] if profile.data else None
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login")
async def login(email: str, password: str):
    """Login user (simplified for demo)"""
    try:
        # Get user profile from Supabase
        profile = supabase.table("oe_users").select("*").eq("email", email).single().execute()
        
        if profile.data:
            return {
                "success": True,
                "user": profile.data,
                "token": "demo-token-" + str(uuid.uuid4())
            }
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/generate")
async def generate_content(request: GenerationRequest):
    """Generate content using Ollama and store in database"""
    try:
        # Enhance the prompt using Ollama
        enhanced_prompt = await prompt_enhancer.enhance_prompt(request.prompt, request.style)
        
        # Check content moderation
        moderation_result = await content_moderator.check_content(enhanced_prompt)
        
        if not moderation_result.get("approved", True):
            return {
                "success": False,
                "error": "Content does not meet quality standards",
                "concerns": moderation_result.get("concerns", [])
            }
        
        # Create a placeholder image (in real scenario, this would use ComfyUI or similar)
        # For now, we'll generate a simple placeholder
        image_id = str(uuid.uuid4())
        image_filename = f"generated/{image_id}.txt"  # Using .txt as placeholder
        image_path = STORAGE_PATH / image_filename
        
        # Save the enhanced prompt as the "image" content (placeholder)
        with open(image_path, "w") as f:
            f.write(f"Generated Image Placeholder\n")
            f.write(f"Original Prompt: {request.prompt}\n")
            f.write(f"Enhanced Prompt: {enhanced_prompt}\n")
            f.write(f"Style: {request.style}\n")
            f.write(f"Quality: {request.quality}\n")
            f.write(f"Generated at: {datetime.utcnow().isoformat()}\n")
        
        # Store in database
        content_record = supabase.table("oe_content").insert({
            "user_id": request.user_id or "00000000-0000-0000-0000-000000000000",
            "prompt": request.prompt,
            "image_url": f"/storage/{image_filename}",
            "style": request.style,
            "quality": request.quality,
            "status": "completed",
            "metadata": {
                "enhanced_prompt": enhanced_prompt,
                "moderation": moderation_result,
                "file_path": str(image_path)
            }
        }).execute()
        
        # Get targeting suggestions from Ollama
        targeting_suggestions = await ollama_client.generate_targeting_suggestions(
            "generated content", request.style
        )
        
        return {
            "success": True,
            "content_id": content_record.data[0]["id"] if content_record.data else image_id,
            "image_url": f"/storage/{image_filename}",
            "enhanced_prompt": enhanced_prompt,
            "targeting_suggestions": targeting_suggestions,
            "metadata": {
                "original_prompt": request.prompt,
                "style": request.style,
                "quality": request.quality
            }
        }
        
    except Exception as e:
        print(f"Generation error: {e}")
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/api/content/{user_id}")
async def get_user_content(user_id: str):
    """Get all content for a user"""
    try:
        content = supabase.table("oe_content").select("*").eq("user_id", user_id).execute()
        return {
            "success": True,
            "content": content.data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/library")
async def get_library():
    """Get content library"""
    try:
        # Get recent content from database
        content = supabase.table("oe_content").select("*").limit(20).execute()
        
        # Enrich with analytics data
        for item in content.data:
            # Add mock analytics (in production, would query analytics table)
            item["views"] = 100 + (hash(item["id"]) % 500)
            item["downloads"] = 10 + (hash(item["id"]) % 50)
            item["engagement_rate"] = 15 + (hash(item["id"]) % 30)
        
        return {
            "success": True,
            "items": content.data,
            "total": len(content.data)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/analyze")
async def analyze_prompt(prompt: str):
    """Analyze a prompt using Ollama"""
    try:
        # Get quality analysis from Ollama
        quality_analysis = await ollama_client.analyze_image_quality(prompt)
        
        # Get enhancement suggestions
        enhanced = await prompt_enhancer.enhance_prompt(prompt)
        
        # Get targeting suggestions
        targets = await ollama_client.generate_targeting_suggestions("content", "general")
        
        return {
            "success": True,
            "analysis": {
                "quality": quality_analysis,
                "enhanced_prompt": enhanced,
                "suggested_targets": targets,
                "recommendations": [
                    "Use more specific visual details",
                    "Include lighting and atmosphere description",
                    "Specify composition and framing"
                ]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a file to storage"""
    try:
        # Save uploaded file
        file_id = str(uuid.uuid4())
        file_extension = file.filename.split(".")[-1] if "." in file.filename else "txt"
        filename = f"uploads/{file_id}.{file_extension}"
        file_path = STORAGE_PATH / filename
        
        # Save file
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        
        return {
            "success": True,
            "file_url": f"/storage/{filename}",
            "file_id": file_id,
            "filename": file.filename,
            "size": len(content)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/stats")
async def get_stats():
    """Get platform statistics"""
    try:
        # Get stats from database - using oe_ tables
        total_content = supabase.table("oe_content").select("id", count="exact").execute()
        total_users = supabase.table("oe_users").select("id", count="exact").execute()
        
        # Get Ollama status
        ollama_status = "online"
        try:
            test = await ollama_client.generate("test", model="mistral")
            if "error" in test:
                ollama_status = "error"
        except:
            ollama_status = "offline"
        
        return {
            "success": True,
            "stats": {
                "total_content": total_content.count if hasattr(total_content, 'count') else 0,
                "total_users": total_users.count if hasattr(total_users, 'count') else 0,
                "storage_used": sum(f.stat().st_size for f in STORAGE_PATH.rglob("*") if f.is_file()),
                "ollama_status": ollama_status,
                "supabase_status": "online"
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "stats": {
                "total_content": 0,
                "total_users": 0,
                "storage_used": 0,
                "ollama_status": "unknown",
                "supabase_status": "error"
            }
        }

@app.get("/api/test-ollama")
async def test_ollama():
    """Test Ollama connection"""
    try:
        response = await ollama_client.generate("Hello, are you working?", model="mistral")
        return {
            "success": True,
            "response": response.get("response", "No response"),
            "model": "mistral",
            "status": "online"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "status": "offline"
        }

@app.get("/api/test-db")
async def test_database():
    """Test database connection"""
    try:
        # Simple query to test connection
        result = supabase.table("oe_users").select("id").limit(1).execute()
        return {
            "success": True,
            "status": "online",
            "message": "Database connection successful"
        }
    except Exception as e:
        return {
            "success": False,
            "status": "offline",
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)  # Using port 8001 to not conflict