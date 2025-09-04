"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Database, Cpu, HardDrive, Wifi, AlertCircle, CheckCircle2, XCircle } from "lucide-react"

interface SystemStatus {
  backend: "online" | "offline" | "error"
  database: "online" | "offline" | "error"
  ollama: "online" | "offline" | "error"
  storage: {
    used: number
    total: number
    percentage: number
  }
  content: {
    total: number
    processing: number
    completed: number
  }
  performance: {
    cpu: number
    memory: number
    requests: number
  }
}

export function SystemHealth() {
  const [status, setStatus] = useState<SystemStatus>({
    backend: "offline",
    database: "offline",
    ollama: "offline",
    storage: { used: 0, total: 100, percentage: 0 },
    content: { total: 0, processing: 0, completed: 0 },
    performance: { cpu: 0, memory: 0, requests: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const checkSystemHealth = async () => {
    try {
      // Check backend status
      const backendCheck = await fetch("http://localhost:8001/api/stats")
        .then(r => r.ok ? "online" : "error")
        .catch(() => "offline")
      
      // Check database (through backend)
      const dbCheck = await fetch("http://localhost:8001/api/test-db")
        .then(r => r.ok ? "online" : "error")
        .catch(() => "offline")
      
      // Check Ollama
      const ollamaCheck = await fetch("http://localhost:8001/api/test-ollama")
        .then(async r => {
          const data = await r.json()
          return data.success ? "online" : "error"
        })
        .catch(() => "offline")
      
      // Get detailed stats
      const statsResponse = await fetch("http://localhost:8001/api/stats")
      const stats = statsResponse.ok ? await statsResponse.json() : null
      
      setStatus({
        backend: backendCheck as "online" | "offline" | "error",
        database: stats?.stats?.supabase_status === "online" ? "online" : "offline",
        ollama: stats?.stats?.ollama_status === "online" ? "online" : "offline",
        storage: {
          used: stats?.stats?.storage_used || 0,
          total: 10737418240, // 10GB
          percentage: ((stats?.stats?.storage_used || 0) / 10737418240) * 100
        },
        content: {
          total: stats?.stats?.total_content || 0,
          processing: 0,
          completed: stats?.stats?.total_content || 0
        },
        performance: {
          cpu: Math.random() * 100, // Mock for now
          memory: Math.random() * 100, // Mock for now
          requests: Math.floor(Math.random() * 1000)
        }
      })
      
      setLastUpdate(new Date())
      setLoading(false)
    } catch (error) {
      console.error("Health check error:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSystemHealth()
    const interval = setInterval(checkSystemHealth, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: "online" | "offline" | "error") => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "offline":
        return <XCircle className="h-4 w-4 text-gray-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: "online" | "offline" | "error") => {
    const variant = status === "online" ? "default" : status === "error" ? "destructive" : "secondary"
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status}
      </Badge>
    )
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i]
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            Updated {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Status */}
        <div>
          <h3 className="font-semibold mb-3">Services</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Backend</span>
              </div>
              {getStatusBadge(status.backend)}
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Database</span>
              </div>
              {getStatusBadge(status.database)}
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">AI Engine</span>
              </div>
              {getStatusBadge(status.ollama)}
            </div>
          </div>
        </div>

        {/* Storage */}
        <div>
          <h3 className="font-semibold mb-3">Storage</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                Storage Usage
              </span>
              <span>{formatBytes(status.storage.used)} / {formatBytes(status.storage.total)}</span>
            </div>
            <Progress value={status.storage.percentage} className="h-2" />
          </div>
        </div>

        {/* Content Stats */}
        <div>
          <h3 className="font-semibold mb-3">Content</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 border rounded-lg">
              <div className="text-2xl font-bold">{status.content.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{status.content.processing}</div>
              <div className="text-xs text-muted-foreground">Processing</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{status.content.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div>
          <h3 className="font-semibold mb-3">Performance</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>CPU Usage</span>
                <span>{Math.round(status.performance.cpu)}%</span>
              </div>
              <Progress value={status.performance.cpu} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Memory Usage</span>
                <span>{Math.round(status.performance.memory)}%</span>
              </div>
              <Progress value={status.performance.memory} className="h-2" />
            </div>
            <div className="flex items-center justify-between text-sm pt-2">
              <span>API Requests (24h)</span>
              <span className="font-mono">{status.performance.requests.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}