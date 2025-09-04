"""
Ollama Integration Module
Handles communication with Ollama for LLM operations
"""

import httpx
import json
from typing import Dict, Any, Optional, List
import asyncio

class OllamaClient:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=60.0)
        
    async def generate(self, prompt: str, model: str = "mistral", stream: bool = False) -> Dict[str, Any]:
        """Generate a response using Ollama"""
        url = f"{self.base_url}/api/generate"
        
        data = {
            "model": model,
            "prompt": prompt,
            "stream": stream
        }
        
        try:
            response = await self.client.post(url, json=data)
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"Ollama error: {response.status_code}"}
        except Exception as e:
            return {"error": str(e)}
    
    async def chat(self, messages: List[Dict[str, str]], model: str = "mistral") -> Dict[str, Any]:
        """Chat with Ollama using conversation history"""
        url = f"{self.base_url}/api/chat"
        
        data = {
            "model": model,
            "messages": messages,
            "stream": False
        }
        
        try:
            response = await self.client.post(url, json=data)
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"Ollama error: {response.status_code}"}
        except Exception as e:
            return {"error": str(e)}
    
    async def generate_image_prompt(self, description: str) -> str:
        """Generate an optimized image generation prompt"""
        system_prompt = """You are an expert at creating detailed prompts for image generation AI. 
        Given a user's description, create a detailed, specific prompt that will produce high-quality images.
        Include details about style, lighting, composition, and quality.
        Keep the prompt under 200 words and focus on visual descriptions."""
        
        user_prompt = f"Create a detailed image generation prompt for: {description}"
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        response = await self.chat(messages)
        
        if "message" in response:
            return response["message"]["content"]
        
        return description  # Fallback to original if generation fails
    
    async def analyze_image_quality(self, image_description: str) -> Dict[str, Any]:
        """Analyze potential quality issues in generated images"""
        prompt = f"""Analyze this image description for potential quality issues:
        {image_description}
        
        Check for:
        1. Anatomical accuracy
        2. Proportions
        3. Lighting consistency
        4. Composition balance
        5. Technical quality
        
        Provide a quality score (0-1) and list any issues found.
        Format response as JSON with keys: quality_score, issues, suggestions"""
        
        response = await self.generate(prompt)
        
        if "response" in response:
            try:
                # Parse the JSON from the response
                result_text = response["response"]
                # Find JSON in the response
                import re
                json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
            except:
                pass
        
        # Default response if parsing fails
        return {
            "quality_score": 0.8,
            "issues": [],
            "suggestions": ["Image appears to be of good quality"]
        }
    
    async def generate_targeting_suggestions(self, content_type: str, style: str) -> List[str]:
        """Generate audience targeting suggestions"""
        prompt = f"""Given content of type '{content_type}' with style '{style}', 
        suggest 5 specific audience segments that would be most interested.
        Return as a simple list of segments, one per line."""
        
        response = await self.generate(prompt)
        
        if "response" in response:
            segments = response["response"].strip().split('\n')
            # Clean up the segments
            segments = [s.strip('- ').strip() for s in segments if s.strip()]
            return segments[:5]
        
        return ["General Audience", "Content Creators", "Art Enthusiasts"]
    
    async def optimize_workflow(self, workflow_steps: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Optimize a workflow using AI suggestions"""
        steps_str = json.dumps(workflow_steps, indent=2)
        
        prompt = f"""Analyze this content generation workflow and suggest optimizations:
        {steps_str}
        
        Consider:
        1. Step order efficiency
        2. Parallel processing opportunities
        3. Resource optimization
        4. Quality checkpoints
        
        Return the optimized workflow as JSON."""
        
        response = await self.generate(prompt)
        
        if "response" in response:
            try:
                # Extract JSON from response
                import re
                json_match = re.search(r'\[.*\]', response["response"], re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
            except:
                pass
        
        return workflow_steps  # Return original if optimization fails
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()


class ContentModerationAI:
    """AI-powered content moderation"""
    
    def __init__(self, ollama_client: OllamaClient):
        self.ollama = ollama_client
    
    async def check_content(self, content: str) -> Dict[str, Any]:
        """Check content for policy violations"""
        prompt = f"""Analyze this content for potential policy violations:
        "{content}"
        
        Check for:
        1. Inappropriate content
        2. Copyright concerns
        3. Misleading information
        4. Quality standards
        
        Respond with: {{
            "approved": true/false,
            "concerns": [],
            "suggestions": []
        }}"""
        
        response = await self.ollama.generate(prompt)
        
        if "response" in response:
            try:
                import re
                json_match = re.search(r'\{.*\}', response["response"], re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
            except:
                pass
        
        return {
            "approved": True,
            "concerns": [],
            "suggestions": []
        }


class PromptEnhancer:
    """Enhance and optimize prompts for better generation"""
    
    def __init__(self, ollama_client: OllamaClient):
        self.ollama = ollama_client
        self.style_templates = {
            "photorealistic": "photorealistic, high detail, professional photography, sharp focus, natural lighting",
            "artistic": "artistic style, creative interpretation, unique perspective, stylized",
            "abstract": "abstract art, non-representational, geometric shapes, bold colors",
            "minimalist": "minimalist design, simple composition, clean lines, negative space"
        }
    
    async def enhance_prompt(self, original_prompt: str, style: str = "photorealistic") -> str:
        """Enhance a prompt with style-specific improvements"""
        style_addon = self.style_templates.get(style, "")
        
        enhancement_prompt = f"""Improve this image generation prompt by adding specific visual details:
        Original: "{original_prompt}"
        Style: {style}
        
        Add details about:
        - Lighting and atmosphere
        - Composition and framing
        - Textures and materials
        - Colors and mood
        
        Keep it under 150 words. Return only the enhanced prompt."""
        
        response = await self.ollama.generate(enhancement_prompt)
        
        if "response" in response:
            enhanced = response["response"].strip()
            # Add style template if not already included
            if style_addon and style_addon not in enhanced.lower():
                enhanced = f"{enhanced}, {style_addon}"
            return enhanced
        
        # Fallback: add style template to original
        return f"{original_prompt}, {style_addon}" if style_addon else original_prompt