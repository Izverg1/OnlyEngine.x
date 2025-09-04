#!/usr/bin/env python3
"""
Service Monitor - Automated health check and restart mechanism for OnlyEngine.x
"""

import subprocess
import time
import requests
import psutil
import os
import sys
from datetime import datetime
from typing import Dict, Optional

class ServiceMonitor:
    def __init__(self):
        self.services = {
            "frontend": {
                "name": "Next.js Frontend",
                "port": 3001,
                "health_check": "http://localhost:3001",
                "start_command": "cd creative-agency-portfolio && npm run dev",
                "process_name": "node"
            },
            "backend": {
                "name": "FastAPI Backend",
                "port": 8001,
                "health_check": "http://localhost:8001/api/stats",
                "start_command": "cd backend && python real_main.py",
                "process_name": "python"
            },
            "supabase": {
                "name": "Supabase Database",
                "port": 54321,
                "health_check": "http://localhost:54321/rest/v1/",
                "start_command": "supabase start",
                "process_name": "postgres"
            },
            "ollama": {
                "name": "Ollama AI Engine",
                "port": 11434,
                "health_check": "http://localhost:11434/api/tags",
                "start_command": "ollama serve",
                "process_name": "ollama"
            }
        }
        
        self.check_interval = 30  # seconds
        self.restart_delay = 10  # seconds
        self.max_restart_attempts = 3
        self.restart_counts: Dict[str, int] = {key: 0 for key in self.services}
        
    def check_port(self, port: int) -> bool:
        """Check if a port is in use"""
        for conn in psutil.net_connections():
            if conn.laddr.port == port and conn.status == 'LISTEN':
                return True
        return False
    
    def health_check(self, service_key: str) -> bool:
        """Perform health check for a service"""
        service = self.services[service_key]
        
        # First check if port is open
        if not self.check_port(service["port"]):
            return False
        
        # Then check HTTP endpoint if available
        if service["health_check"]:
            try:
                response = requests.get(service["health_check"], timeout=5)
                return response.status_code < 500
            except:
                return False
        
        return True
    
    def restart_service(self, service_key: str) -> bool:
        """Restart a service"""
        service = self.services[service_key]
        
        # Check restart limit
        if self.restart_counts[service_key] >= self.max_restart_attempts:
            print(f"⚠️  {service['name']} has exceeded max restart attempts. Manual intervention required.")
            return False
        
        print(f"🔄 Restarting {service['name']}...")
        
        # Kill existing process if needed
        try:
            for proc in psutil.process_iter(['name', 'cmdline']):
                if service["process_name"] in proc.info['name'].lower():
                    if any(service_key in ' '.join(proc.info['cmdline']) for _ in [1]):
                        proc.kill()
                        time.sleep(2)
                        break
        except:
            pass
        
        # Start the service
        try:
            subprocess.Popen(
                service["start_command"],
                shell=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                start_new_session=True
            )
            
            time.sleep(self.restart_delay)
            
            # Verify service started
            if self.health_check(service_key):
                print(f"✅ {service['name']} restarted successfully")
                self.restart_counts[service_key] += 1
                return True
            else:
                print(f"❌ {service['name']} failed to start properly")
                return False
                
        except Exception as e:
            print(f"❌ Error restarting {service['name']}: {e}")
            return False
    
    def monitor_loop(self):
        """Main monitoring loop"""
        print("🚀 OnlyEngine.x Service Monitor Started")
        print(f"📊 Checking services every {self.check_interval} seconds")
        print("-" * 50)
        
        while True:
            try:
                status_report = []
                needs_restart = []
                
                for service_key, service in self.services.items():
                    is_healthy = self.health_check(service_key)
                    
                    if is_healthy:
                        status = "✅ Online"
                        # Reset restart count on successful check
                        if self.restart_counts[service_key] > 0:
                            self.restart_counts[service_key] = 0
                    else:
                        status = "❌ Offline"
                        needs_restart.append(service_key)
                    
                    status_report.append(f"{service['name']}: {status}")
                
                # Print status
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                print(f"\n[{timestamp}] Service Status:")
                for report in status_report:
                    print(f"  {report}")
                
                # Restart failed services
                for service_key in needs_restart:
                    self.restart_service(service_key)
                
                # Sleep until next check
                time.sleep(self.check_interval)
                
            except KeyboardInterrupt:
                print("\n\n👋 Service Monitor Stopped")
                sys.exit(0)
            except Exception as e:
                print(f"⚠️  Monitor error: {e}")
                time.sleep(self.check_interval)
    
    def start_all_services(self):
        """Start all services on initial launch"""
        print("🎬 Starting all services...")
        
        for service_key, service in self.services.items():
            if not self.health_check(service_key):
                print(f"Starting {service['name']}...")
                subprocess.Popen(
                    service["start_command"],
                    shell=True,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    start_new_session=True
                )
                time.sleep(5)
        
        print("✅ All services started\n")

def main():
    monitor = ServiceMonitor()
    
    # Check if we should start all services first
    if "--start-all" in sys.argv:
        monitor.start_all_services()
    
    # Run monitoring loop
    monitor.monitor_loop()

if __name__ == "__main__":
    main()