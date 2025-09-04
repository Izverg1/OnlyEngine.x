"""
Platform Integration Module
Handles connections to various content distribution platforms
"""

import asyncio
import httpx
from typing import Dict, Any, List, Optional
from datetime import datetime
import hashlib
import hmac
import base64
from abc import ABC, abstractmethod

class PlatformIntegration(ABC):
    """Base class for platform integrations"""
    
    def __init__(self, api_key: str, api_secret: str = None):
        self.api_key = api_key
        self.api_secret = api_secret
        self.client = httpx.AsyncClient(timeout=30.0)
    
    @abstractmethod
    async def authenticate(self) -> bool:
        """Authenticate with the platform"""
        pass
    
    @abstractmethod
    async def upload_content(self, content_data: bytes, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Upload content to the platform"""
        pass
    
    @abstractmethod
    async def schedule_post(self, content_id: str, scheduled_time: datetime, caption: str = "") -> Dict[str, Any]:
        """Schedule a post for later"""
        pass
    
    @abstractmethod
    async def get_analytics(self, content_id: str) -> Dict[str, Any]:
        """Get analytics for specific content"""
        pass
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()


class OnlyFansIntegration(PlatformIntegration):
    """OnlyFans platform integration"""
    
    def __init__(self, api_key: str, api_secret: str = None):
        super().__init__(api_key, api_secret)
        self.base_url = "https://onlyfans.com/api2/v2"
        self.user_id = None
        self.session_token = None
    
    async def authenticate(self) -> bool:
        """Authenticate with OnlyFans API"""
        # Note: Simplified authentication flow
        # In production, implement proper OAuth flow
        headers = {
            "User-Agent": "OnlyEngine.x/1.0",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        try:
            response = await self.client.get(
                f"{self.base_url}/users/me",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                self.user_id = data.get("id")
                self.session_token = data.get("sessionToken")
                return True
            
        except Exception as e:
            print(f"Authentication failed: {e}")
        
        return False
    
    async def upload_content(self, content_data: bytes, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Upload content to OnlyFans"""
        if not self.session_token:
            await self.authenticate()
        
        headers = {
            "Authorization": f"Bearer {self.session_token}",
            "Content-Type": "multipart/form-data"
        }
        
        files = {
            "file": ("image.jpg", content_data, "image/jpeg")
        }
        
        data = {
            "caption": metadata.get("caption", ""),
            "price": metadata.get("price", 0),
            "isPublic": metadata.get("is_public", True)
        }
        
        try:
            response = await self.client.post(
                f"{self.base_url}/posts",
                headers=headers,
                files=files,
                data=data
            )
            
            if response.status_code == 201:
                return {
                    "success": True,
                    "post_id": response.json().get("id"),
                    "url": response.json().get("url")
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def schedule_post(self, content_id: str, scheduled_time: datetime, caption: str = "") -> Dict[str, Any]:
        """Schedule a post on OnlyFans"""
        if not self.session_token:
            await self.authenticate()
        
        headers = {
            "Authorization": f"Bearer {self.session_token}",
            "Content-Type": "application/json"
        }
        
        data = {
            "contentId": content_id,
            "scheduledTime": scheduled_time.isoformat(),
            "caption": caption
        }
        
        try:
            response = await self.client.post(
                f"{self.base_url}/scheduled-posts",
                headers=headers,
                json=data
            )
            
            if response.status_code == 201:
                return {
                    "success": True,
                    "scheduled_id": response.json().get("id")
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_analytics(self, content_id: str) -> Dict[str, Any]:
        """Get analytics for OnlyFans content"""
        if not self.session_token:
            await self.authenticate()
        
        headers = {
            "Authorization": f"Bearer {self.session_token}"
        }
        
        try:
            response = await self.client.get(
                f"{self.base_url}/posts/{content_id}/stats",
                headers=headers
            )
            
            if response.status_code == 200:
                return response.json()
        except Exception as e:
            return {"error": str(e)}
        
        return {}
    
    async def get_subscribers(self, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Get subscriber list with optional filters"""
        if not self.session_token:
            await self.authenticate()
        
        headers = {
            "Authorization": f"Bearer {self.session_token}"
        }
        
        params = filters or {}
        
        try:
            response = await self.client.get(
                f"{self.base_url}/subscribers",
                headers=headers,
                params=params
            )
            
            if response.status_code == 200:
                return response.json().get("subscribers", [])
        except Exception as e:
            print(f"Failed to get subscribers: {e}")
        
        return []


class FanslyIntegration(PlatformIntegration):
    """Fansly platform integration"""
    
    def __init__(self, api_key: str, api_secret: str = None):
        super().__init__(api_key, api_secret)
        self.base_url = "https://apiv3.fansly.com/api/v1"
    
    async def authenticate(self) -> bool:
        """Authenticate with Fansly API"""
        headers = {
            "Authorization": self.api_key
        }
        
        try:
            response = await self.client.get(
                f"{self.base_url}/account",
                headers=headers
            )
            
            return response.status_code == 200
        except Exception:
            return False
    
    async def upload_content(self, content_data: bytes, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Upload content to Fansly"""
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "multipart/form-data"
        }
        
        files = {
            "media": ("image.jpg", content_data, "image/jpeg")
        }
        
        data = {
            "content": metadata.get("caption", ""),
            "price": metadata.get("price", 0),
            "preview": metadata.get("preview", False)
        }
        
        try:
            response = await self.client.post(
                f"{self.base_url}/post",
                headers=headers,
                files=files,
                data=data
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "post_id": response.json().get("id")
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def schedule_post(self, content_id: str, scheduled_time: datetime, caption: str = "") -> Dict[str, Any]:
        """Schedule a post on Fansly"""
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json"
        }
        
        data = {
            "mediaId": content_id,
            "scheduledAt": int(scheduled_time.timestamp()),
            "content": caption
        }
        
        try:
            response = await self.client.post(
                f"{self.base_url}/post/schedule",
                headers=headers,
                json=data
            )
            
            return {
                "success": response.status_code == 200,
                "scheduled_id": response.json().get("id") if response.status_code == 200 else None
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_analytics(self, content_id: str) -> Dict[str, Any]:
        """Get analytics for Fansly content"""
        headers = {
            "Authorization": self.api_key
        }
        
        try:
            response = await self.client.get(
                f"{self.base_url}/post/{content_id}/stats",
                headers=headers
            )
            
            if response.status_code == 200:
                return response.json()
        except Exception:
            pass
        
        return {}


class FeetFinderIntegration(PlatformIntegration):
    """FeetFinder platform integration"""
    
    def __init__(self, api_key: str, api_secret: str = None):
        super().__init__(api_key, api_secret)
        self.base_url = "https://api.feetfinder.com/v1"
    
    async def authenticate(self) -> bool:
        """Authenticate with FeetFinder API"""
        headers = {
            "X-API-Key": self.api_key
        }
        
        if self.api_secret:
            # Generate HMAC signature for authentication
            timestamp = str(int(datetime.now().timestamp()))
            message = f"{timestamp}:{self.api_key}"
            signature = hmac.new(
                self.api_secret.encode(),
                message.encode(),
                hashlib.sha256
            ).hexdigest()
            
            headers["X-Signature"] = signature
            headers["X-Timestamp"] = timestamp
        
        try:
            response = await self.client.get(
                f"{self.base_url}/auth/verify",
                headers=headers
            )
            
            return response.status_code == 200
        except Exception:
            return False
    
    async def upload_content(self, content_data: bytes, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Upload content to FeetFinder"""
        headers = {
            "X-API-Key": self.api_key
        }
        
        files = {
            "image": ("image.jpg", content_data, "image/jpeg")
        }
        
        data = {
            "title": metadata.get("title", ""),
            "description": metadata.get("caption", ""),
            "tags": ",".join(metadata.get("tags", [])),
            "price": metadata.get("price", 0)
        }
        
        try:
            response = await self.client.post(
                f"{self.base_url}/content/upload",
                headers=headers,
                files=files,
                data=data
            )
            
            if response.status_code == 201:
                return {
                    "success": True,
                    "content_id": response.json().get("contentId")
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def schedule_post(self, content_id: str, scheduled_time: datetime, caption: str = "") -> Dict[str, Any]:
        """Schedule a post on FeetFinder"""
        headers = {
            "X-API-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        data = {
            "contentId": content_id,
            "publishAt": scheduled_time.isoformat(),
            "caption": caption
        }
        
        try:
            response = await self.client.post(
                f"{self.base_url}/content/schedule",
                headers=headers,
                json=data
            )
            
            return {
                "success": response.status_code == 200,
                "schedule_id": response.json().get("scheduleId") if response.status_code == 200 else None
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_analytics(self, content_id: str) -> Dict[str, Any]:
        """Get analytics for FeetFinder content"""
        headers = {
            "X-API-Key": self.api_key
        }
        
        try:
            response = await self.client.get(
                f"{self.base_url}/content/{content_id}/analytics",
                headers=headers
            )
            
            if response.status_code == 200:
                return response.json()
        except Exception:
            pass
        
        return {}


class PlatformManager:
    """Manages multiple platform integrations"""
    
    def __init__(self):
        self.platforms: Dict[str, PlatformIntegration] = {}
    
    def add_platform(self, name: str, integration: PlatformIntegration):
        """Add a platform integration"""
        self.platforms[name] = integration
    
    async def upload_to_all(self, content_data: bytes, metadata: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
        """Upload content to all configured platforms"""
        results = {}
        
        for platform_name, platform in self.platforms.items():
            try:
                result = await platform.upload_content(content_data, metadata)
                results[platform_name] = result
            except Exception as e:
                results[platform_name] = {
                    "success": False,
                    "error": str(e)
                }
        
        return results
    
    async def schedule_to_platforms(
        self, 
        platforms: List[str], 
        content_id: str, 
        scheduled_time: datetime, 
        caption: str = ""
    ) -> Dict[str, Dict[str, Any]]:
        """Schedule content to specific platforms"""
        results = {}
        
        for platform_name in platforms:
            if platform_name in self.platforms:
                platform = self.platforms[platform_name]
                try:
                    result = await platform.schedule_post(content_id, scheduled_time, caption)
                    results[platform_name] = result
                except Exception as e:
                    results[platform_name] = {
                        "success": False,
                        "error": str(e)
                    }
        
        return results
    
    async def get_combined_analytics(self, content_id: str) -> Dict[str, Any]:
        """Get combined analytics from all platforms"""
        analytics = {}
        
        for platform_name, platform in self.platforms.items():
            try:
                platform_analytics = await platform.get_analytics(content_id)
                analytics[platform_name] = platform_analytics
            except Exception as e:
                analytics[platform_name] = {"error": str(e)}
        
        # Calculate combined metrics
        total_views = sum(
            data.get("views", 0) for data in analytics.values() 
            if isinstance(data, dict) and "views" in data
        )
        
        total_revenue = sum(
            data.get("revenue", 0) for data in analytics.values()
            if isinstance(data, dict) and "revenue" in data
        )
        
        return {
            "platforms": analytics,
            "combined": {
                "total_views": total_views,
                "total_revenue": total_revenue
            }
        }
    
    async def close_all(self):
        """Close all platform connections"""
        for platform in self.platforms.values():
            await platform.close()