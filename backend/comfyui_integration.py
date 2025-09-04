"""
ComfyUI Integration Module
Handles communication with ComfyUI for image generation workflows
"""

import json
import asyncio
import httpx
from typing import Dict, Any, Optional
from pathlib import Path
import uuid

class ComfyUIClient:
    def __init__(self, base_url: str = "http://localhost:8188"):
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=60.0)
        
    async def get_workflow(self, workflow_name: str) -> Dict[str, Any]:
        """Load a workflow template from file"""
        workflow_path = Path(f"workflows/{workflow_name}.json")
        if not workflow_path.exists():
            raise FileNotFoundError(f"Workflow {workflow_name} not found")
        
        with open(workflow_path, "r") as f:
            return json.load(f)
    
    async def modify_workflow(self, workflow: Dict[str, Any], prompt: str, style: str = "photorealistic", quality: str = "standard") -> Dict[str, Any]:
        """Modify workflow with generation parameters"""
        # Find and update the prompt node
        for node_id, node in workflow.items():
            if node.get("class_type") == "CLIPTextEncode" and "positive" in node.get("_meta", {}).get("title", "").lower():
                node["inputs"]["text"] = prompt
            
            # Update sampler settings based on quality
            if node.get("class_type") == "KSampler":
                if quality == "high":
                    node["inputs"]["steps"] = 30
                    node["inputs"]["cfg"] = 8.0
                elif quality == "ultra":
                    node["inputs"]["steps"] = 50
                    node["inputs"]["cfg"] = 10.0
                else:  # standard
                    node["inputs"]["steps"] = 20
                    node["inputs"]["cfg"] = 7.0
        
        return workflow
    
    async def queue_prompt(self, workflow: Dict[str, Any]) -> str:
        """Queue a workflow for execution"""
        prompt_id = str(uuid.uuid4())
        
        # Prepare the API request
        data = {
            "prompt": workflow,
            "client_id": prompt_id
        }
        
        response = await self.client.post(
            f"{self.base_url}/prompt",
            json=data
        )
        
        if response.status_code != 200:
            raise Exception(f"Failed to queue prompt: {response.text}")
        
        result = response.json()
        return result.get("prompt_id", prompt_id)
    
    async def get_generation_status(self, prompt_id: str) -> Dict[str, Any]:
        """Check the status of a generation"""
        response = await self.client.get(
            f"{self.base_url}/history/{prompt_id}"
        )
        
        if response.status_code != 200:
            return {"status": "processing"}
        
        history = response.json()
        
        if prompt_id in history:
            prompt_info = history[prompt_id]
            if "outputs" in prompt_info:
                # Find the output image
                for node_id, output in prompt_info["outputs"].items():
                    if "images" in output:
                        images = output["images"]
                        if images:
                            return {
                                "status": "completed",
                                "images": images,
                                "filename": images[0]["filename"],
                                "subfolder": images[0].get("subfolder", ""),
                                "type": images[0].get("type", "output")
                            }
            
            # Check if there was an error
            if prompt_info.get("status", {}).get("status_str") == "error":
                return {
                    "status": "error",
                    "error": prompt_info.get("status", {}).get("error", "Unknown error")
                }
        
        return {"status": "processing"}
    
    async def get_image(self, filename: str, subfolder: str = "", image_type: str = "output") -> bytes:
        """Retrieve generated image data"""
        params = {
            "filename": filename,
            "subfolder": subfolder,
            "type": image_type
        }
        
        response = await self.client.get(
            f"{self.base_url}/view",
            params=params
        )
        
        if response.status_code != 200:
            raise Exception(f"Failed to retrieve image: {response.text}")
        
        return response.content
    
    async def generate_image(self, prompt: str, style: str = "photorealistic", quality: str = "standard", workflow_name: str = "default") -> Dict[str, Any]:
        """Complete image generation pipeline"""
        # Load and modify workflow
        workflow = await self.get_workflow(workflow_name)
        workflow = await self.modify_workflow(workflow, prompt, style, quality)
        
        # Queue the generation
        prompt_id = await self.queue_prompt(workflow)
        
        # Poll for completion
        max_attempts = 60  # 60 seconds timeout
        for _ in range(max_attempts):
            status = await self.get_generation_status(prompt_id)
            
            if status["status"] == "completed":
                # Get the image data
                image_data = await self.get_image(
                    status["filename"],
                    status.get("subfolder", ""),
                    status.get("type", "output")
                )
                
                return {
                    "success": True,
                    "prompt_id": prompt_id,
                    "image_data": image_data,
                    "filename": status["filename"],
                    "metadata": {
                        "prompt": prompt,
                        "style": style,
                        "quality": quality,
                        "workflow": workflow_name
                    }
                }
            
            elif status["status"] == "error":
                return {
                    "success": False,
                    "error": status.get("error", "Generation failed"),
                    "prompt_id": prompt_id
                }
            
            await asyncio.sleep(1)
        
        return {
            "success": False,
            "error": "Generation timeout",
            "prompt_id": prompt_id
        }
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()


# Quality Assurance Module
class QualityAssurance:
    def __init__(self, mixtral_client=None):
        self.mixtral_client = mixtral_client
        
    async def analyze_image(self, image_data: bytes) -> Dict[str, Any]:
        """Analyze generated image for quality issues"""
        # Placeholder for actual image analysis
        # In production, this would use CLIP, YOLO, or custom models
        return {
            "quality_score": 0.95,
            "issues": [],
            "suggestions": []
        }
    
    async def check_mutations(self, image_data: bytes, expected_features: list) -> Dict[str, Any]:
        """Check for mutations or unwanted artifacts"""
        # Placeholder for mutation detection
        # Would integrate with Mixtral for analysis
        return {
            "has_mutations": False,
            "mutation_details": [],
            "confidence": 0.98
        }
    
    async def suggest_improvements(self, analysis_results: Dict[str, Any], original_prompt: str) -> str:
        """Generate improved prompt based on QA results"""
        if not analysis_results.get("issues"):
            return original_prompt
        
        # Use Mixtral to generate improved prompt
        # Placeholder implementation
        return f"{original_prompt}, high quality, no artifacts"


# Workflow Manager
class WorkflowManager:
    def __init__(self):
        self.workflows = {}
        self.load_workflows()
    
    def load_workflows(self):
        """Load available workflow templates"""
        workflows_dir = Path("workflows")
        workflows_dir.mkdir(exist_ok=True)
        
        # Create default workflow if it doesn't exist
        default_workflow_path = workflows_dir / "default.json"
        if not default_workflow_path.exists():
            self.create_default_workflow(default_workflow_path)
        
        # Load all workflow files
        for workflow_file in workflows_dir.glob("*.json"):
            name = workflow_file.stem
            with open(workflow_file, "r") as f:
                self.workflows[name] = json.load(f)
    
    def create_default_workflow(self, path: Path):
        """Create a default ComfyUI workflow template"""
        default_workflow = {
            "1": {
                "class_type": "CheckpointLoaderSimple",
                "inputs": {
                    "ckpt_name": "model.safetensors"
                }
            },
            "2": {
                "class_type": "CLIPTextEncode",
                "_meta": {"title": "Positive Prompt"},
                "inputs": {
                    "text": "",
                    "clip": ["1", 1]
                }
            },
            "3": {
                "class_type": "CLIPTextEncode",
                "_meta": {"title": "Negative Prompt"},
                "inputs": {
                    "text": "blurry, bad quality, distorted",
                    "clip": ["1", 1]
                }
            },
            "4": {
                "class_type": "EmptyLatentImage",
                "inputs": {
                    "width": 1024,
                    "height": 1024,
                    "batch_size": 1
                }
            },
            "5": {
                "class_type": "KSampler",
                "inputs": {
                    "seed": -1,
                    "steps": 20,
                    "cfg": 7.0,
                    "sampler_name": "euler_ancestral",
                    "scheduler": "normal",
                    "denoise": 1.0,
                    "model": ["1", 0],
                    "positive": ["2", 0],
                    "negative": ["3", 0],
                    "latent_image": ["4", 0]
                }
            },
            "6": {
                "class_type": "VAEDecode",
                "inputs": {
                    "samples": ["5", 0],
                    "vae": ["1", 2]
                }
            },
            "7": {
                "class_type": "SaveImage",
                "inputs": {
                    "filename_prefix": "OnlyEngine",
                    "images": ["6", 0]
                }
            }
        }
        
        with open(path, "w") as f:
            json.dump(default_workflow, f, indent=2)
    
    def get_workflow(self, name: str) -> Optional[Dict[str, Any]]:
        """Get a workflow by name"""
        return self.workflows.get(name)
    
    def list_workflows(self) -> list:
        """List available workflows"""
        return list(self.workflows.keys())