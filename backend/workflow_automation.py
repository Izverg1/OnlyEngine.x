"""
Workflow Automation Module
Handles automated content generation, quality checks, and distribution
"""

import asyncio
from typing import Dict, Any, List, Optional, Callable
from datetime import datetime, timedelta
from enum import Enum
import json
import uuid
from dataclasses import dataclass, field
import logging

logger = logging.getLogger(__name__)


class WorkflowStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    PAUSED = "paused"


class StepType(Enum):
    GENERATE = "generate"
    QA_CHECK = "qa_check"
    ENHANCE = "enhance"
    TARGET = "target"
    UPLOAD = "upload"
    SCHEDULE = "schedule"
    NOTIFY = "notify"


@dataclass
class WorkflowStep:
    """Represents a single step in a workflow"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    type: StepType = StepType.GENERATE
    name: str = ""
    params: Dict[str, Any] = field(default_factory=dict)
    status: WorkflowStatus = WorkflowStatus.PENDING
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    retry_count: int = 0
    max_retries: int = 3


@dataclass
class Workflow:
    """Represents a complete workflow"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = "Default Workflow"
    steps: List[WorkflowStep] = field(default_factory=list)
    status: WorkflowStatus = WorkflowStatus.PENDING
    created_at: datetime = field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    results: Dict[str, Any] = field(default_factory=dict)


class WorkflowEngine:
    """Executes workflows with proper error handling and retries"""
    
    def __init__(self, comfyui_client=None, qa_system=None, platform_manager=None):
        self.comfyui_client = comfyui_client
        self.qa_system = qa_system
        self.platform_manager = platform_manager
        self.workflows: Dict[str, Workflow] = {}
        self.step_handlers: Dict[StepType, Callable] = {
            StepType.GENERATE: self._handle_generate,
            StepType.QA_CHECK: self._handle_qa_check,
            StepType.ENHANCE: self._handle_enhance,
            StepType.TARGET: self._handle_target,
            StepType.UPLOAD: self._handle_upload,
            StepType.SCHEDULE: self._handle_schedule,
            StepType.NOTIFY: self._handle_notify
        }
        self.running_workflows = set()
    
    async def create_workflow(self, name: str, steps: List[Dict[str, Any]]) -> Workflow:
        """Create a new workflow from configuration"""
        workflow = Workflow(name=name)
        
        for step_config in steps:
            step = WorkflowStep(
                type=StepType(step_config["type"]),
                name=step_config.get("name", step_config["type"]),
                params=step_config.get("params", {})
            )
            workflow.steps.append(step)
        
        self.workflows[workflow.id] = workflow
        return workflow
    
    async def execute_workflow(self, workflow_id: str) -> Dict[str, Any]:
        """Execute a workflow asynchronously"""
        if workflow_id not in self.workflows:
            raise ValueError(f"Workflow {workflow_id} not found")
        
        workflow = self.workflows[workflow_id]
        
        if workflow.id in self.running_workflows:
            return {"error": "Workflow already running"}
        
        self.running_workflows.add(workflow.id)
        workflow.status = WorkflowStatus.RUNNING
        workflow.started_at = datetime.utcnow()
        
        try:
            # Execute steps sequentially
            for step in workflow.steps:
                if workflow.status == WorkflowStatus.CANCELLED:
                    break
                
                await self._execute_step(workflow, step)
                
                if step.status == WorkflowStatus.FAILED:
                    workflow.status = WorkflowStatus.FAILED
                    break
            
            if workflow.status == WorkflowStatus.RUNNING:
                workflow.status = WorkflowStatus.COMPLETED
            
            workflow.completed_at = datetime.utcnow()
            
        except Exception as e:
            logger.error(f"Workflow {workflow_id} failed: {e}")
            workflow.status = WorkflowStatus.FAILED
            workflow.results["error"] = str(e)
        
        finally:
            self.running_workflows.discard(workflow.id)
        
        return workflow.results
    
    async def _execute_step(self, workflow: Workflow, step: WorkflowStep):
        """Execute a single workflow step with retries"""
        step.status = WorkflowStatus.RUNNING
        step.started_at = datetime.utcnow()
        
        handler = self.step_handlers.get(step.type)
        if not handler:
            step.status = WorkflowStatus.FAILED
            step.error = f"No handler for step type {step.type}"
            return
        
        # Retry logic
        while step.retry_count <= step.max_retries:
            try:
                # Pass previous step results as context
                context = self._build_context(workflow, step)
                step.result = await handler(step.params, context)
                step.status = WorkflowStatus.COMPLETED
                step.completed_at = datetime.utcnow()
                
                # Store step result in workflow
                workflow.results[step.name] = step.result
                break
                
            except Exception as e:
                logger.warning(f"Step {step.name} failed (attempt {step.retry_count + 1}): {e}")
                step.retry_count += 1
                
                if step.retry_count > step.max_retries:
                    step.status = WorkflowStatus.FAILED
                    step.error = str(e)
                    break
                
                # Exponential backoff
                await asyncio.sleep(2 ** step.retry_count)
    
    def _build_context(self, workflow: Workflow, current_step: WorkflowStep) -> Dict[str, Any]:
        """Build context for step execution from previous results"""
        context = {
            "workflow_id": workflow.id,
            "workflow_metadata": workflow.metadata,
            "previous_results": {}
        }
        
        # Add results from completed steps
        for step in workflow.steps:
            if step.id == current_step.id:
                break
            if step.status == WorkflowStatus.COMPLETED and step.result:
                context["previous_results"][step.name] = step.result
        
        return context
    
    async def _handle_generate(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle content generation step"""
        if not self.comfyui_client:
            raise ValueError("ComfyUI client not configured")
        
        result = await self.comfyui_client.generate_image(
            prompt=params.get("prompt", ""),
            style=params.get("style", "photorealistic"),
            quality=params.get("quality", "standard"),
            workflow_name=params.get("workflow", "default")
        )
        
        if not result.get("success"):
            raise Exception(result.get("error", "Generation failed"))
        
        return result
    
    async def _handle_qa_check(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle quality assurance check"""
        if not self.qa_system:
            return {"passed": True, "score": 1.0}
        
        # Get image data from previous generation step
        generation_result = context["previous_results"].get("generate", {})
        image_data = generation_result.get("image_data")
        
        if not image_data:
            raise ValueError("No image data found for QA check")
        
        # Perform QA analysis
        analysis = await self.qa_system.analyze_image(image_data)
        mutation_check = await self.qa_system.check_mutations(
            image_data,
            params.get("expected_features", [])
        )
        
        qa_passed = (
            analysis.get("quality_score", 0) >= params.get("min_quality", 0.8) and
            not mutation_check.get("has_mutations", False)
        )
        
        return {
            "passed": qa_passed,
            "quality_score": analysis.get("quality_score"),
            "issues": analysis.get("issues", []),
            "mutations": mutation_check.get("mutation_details", [])
        }
    
    async def _handle_enhance(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle content enhancement step"""
        qa_result = context["previous_results"].get("qa_check", {})
        
        if qa_result.get("passed", True):
            return {"enhanced": False, "reason": "QA passed, no enhancement needed"}
        
        # Generate improved prompt based on QA feedback
        original_prompt = context["previous_results"].get("generate", {}).get("metadata", {}).get("prompt", "")
        
        if self.qa_system:
            improved_prompt = await self.qa_system.suggest_improvements(qa_result, original_prompt)
        else:
            improved_prompt = f"{original_prompt}, high quality, no artifacts"
        
        # Re-generate with improved prompt
        if self.comfyui_client:
            result = await self.comfyui_client.generate_image(
                prompt=improved_prompt,
                style=params.get("style", "photorealistic"),
                quality="high"  # Use higher quality for enhancement
            )
            
            return {
                "enhanced": True,
                "new_prompt": improved_prompt,
                "result": result
            }
        
        return {"enhanced": False, "error": "Enhancement not available"}
    
    async def _handle_target(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle audience targeting step"""
        # Simulate targeting analysis
        segments = params.get("segments", ["general"])
        platforms = params.get("platforms", ["all"])
        
        targeting_result = {
            "recommended_segments": segments,
            "platforms": platforms,
            "estimated_reach": len(segments) * 1000,
            "best_time": (datetime.utcnow() + timedelta(hours=4)).isoformat()
        }
        
        return targeting_result
    
    async def _handle_upload(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle content upload to platforms"""
        if not self.platform_manager:
            return {"uploaded": False, "error": "Platform manager not configured"}
        
        # Get image data from generation or enhancement step
        if "enhance" in context["previous_results"] and context["previous_results"]["enhance"].get("enhanced"):
            image_data = context["previous_results"]["enhance"]["result"].get("image_data")
        else:
            image_data = context["previous_results"].get("generate", {}).get("image_data")
        
        if not image_data:
            raise ValueError("No image data found for upload")
        
        # Upload to specified platforms
        platforms = params.get("platforms", ["all"])
        metadata = {
            "caption": params.get("caption", ""),
            "tags": params.get("tags", []),
            "price": params.get("price", 0)
        }
        
        if platforms == ["all"]:
            results = await self.platform_manager.upload_to_all(image_data, metadata)
        else:
            results = {}
            for platform in platforms:
                if platform in self.platform_manager.platforms:
                    result = await self.platform_manager.platforms[platform].upload_content(
                        image_data, metadata
                    )
                    results[platform] = result
        
        return {"uploaded": True, "results": results}
    
    async def _handle_schedule(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle content scheduling"""
        upload_results = context["previous_results"].get("upload", {}).get("results", {})
        
        if not upload_results:
            return {"scheduled": False, "error": "No uploaded content to schedule"}
        
        scheduled_time = datetime.fromisoformat(params.get("scheduled_time", 
            (datetime.utcnow() + timedelta(hours=1)).isoformat()))
        
        schedule_results = {}
        
        for platform, upload_result in upload_results.items():
            if upload_result.get("success"):
                content_id = upload_result.get("post_id") or upload_result.get("content_id")
                if content_id and self.platform_manager:
                    schedule_result = await self.platform_manager.platforms[platform].schedule_post(
                        content_id, scheduled_time, params.get("caption", "")
                    )
                    schedule_results[platform] = schedule_result
        
        return {"scheduled": True, "results": schedule_results}
    
    async def _handle_notify(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle notifications"""
        notification_type = params.get("type", "email")
        recipient = params.get("recipient", "user@example.com")
        
        # Build notification message
        workflow_status = "completed" if context.get("workflow_status") == WorkflowStatus.COMPLETED else "failed"
        
        message = {
            "type": notification_type,
            "recipient": recipient,
            "subject": f"Workflow {context['workflow_id']} {workflow_status}",
            "body": json.dumps(context["previous_results"], indent=2)
        }
        
        # In production, send actual notification
        logger.info(f"Notification sent: {message}")
        
        return {"notified": True, "message": message}
    
    def get_workflow_status(self, workflow_id: str) -> Dict[str, Any]:
        """Get current workflow status"""
        if workflow_id not in self.workflows:
            return {"error": "Workflow not found"}
        
        workflow = self.workflows[workflow_id]
        
        return {
            "id": workflow.id,
            "name": workflow.name,
            "status": workflow.status.value,
            "created_at": workflow.created_at.isoformat(),
            "started_at": workflow.started_at.isoformat() if workflow.started_at else None,
            "completed_at": workflow.completed_at.isoformat() if workflow.completed_at else None,
            "steps": [
                {
                    "name": step.name,
                    "type": step.type.value,
                    "status": step.status.value,
                    "error": step.error
                }
                for step in workflow.steps
            ],
            "results": workflow.results
        }
    
    async def cancel_workflow(self, workflow_id: str) -> bool:
        """Cancel a running workflow"""
        if workflow_id in self.workflows and workflow_id in self.running_workflows:
            self.workflows[workflow_id].status = WorkflowStatus.CANCELLED
            return True
        return False


# Predefined workflow templates
WORKFLOW_TEMPLATES = {
    "basic_generation": {
        "name": "Basic Content Generation",
        "steps": [
            {
                "type": "generate",
                "name": "generate",
                "params": {
                    "quality": "standard"
                }
            },
            {
                "type": "qa_check",
                "name": "qa_check",
                "params": {
                    "min_quality": 0.8
                }
            }
        ]
    },
    "full_pipeline": {
        "name": "Full Content Pipeline",
        "steps": [
            {
                "type": "generate",
                "name": "generate",
                "params": {
                    "quality": "high"
                }
            },
            {
                "type": "qa_check",
                "name": "qa_check",
                "params": {
                    "min_quality": 0.9
                }
            },
            {
                "type": "enhance",
                "name": "enhance",
                "params": {}
            },
            {
                "type": "target",
                "name": "target",
                "params": {
                    "segments": ["high_engagement", "premium"]
                }
            },
            {
                "type": "upload",
                "name": "upload",
                "params": {
                    "platforms": ["onlyfans", "fansly"]
                }
            },
            {
                "type": "schedule",
                "name": "schedule",
                "params": {}
            },
            {
                "type": "notify",
                "name": "notify",
                "params": {
                    "type": "email"
                }
            }
        ]
    },
    "batch_generation": {
        "name": "Batch Content Generation",
        "steps": [
            {
                "type": "generate",
                "name": "generate_batch",
                "params": {
                    "batch_size": 5,
                    "quality": "standard"
                }
            },
            {
                "type": "qa_check",
                "name": "qa_batch",
                "params": {
                    "min_quality": 0.75
                }
            },
            {
                "type": "target",
                "name": "target_batch",
                "params": {
                    "segments": ["general"]
                }
            }
        ]
    }
}