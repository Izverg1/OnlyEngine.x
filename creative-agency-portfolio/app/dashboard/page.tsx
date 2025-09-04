"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SystemHealth } from "@/components/system-health"
import { motion } from "framer-motion"
import { 
  ArrowUp,
  ArrowDown
} from "lucide-react"
import {
  GeneratorIcon,
  AnalyticsIcon,
  PlatformsIcon,
  BillingIcon,
  AIToolsIcon,
  WorkbenchIcon,
  ModelsIcon,
  DataProcessedIcon,
  APICallsIcon
} from "@/components/workbench-icons"

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // For now, hardcoded as enterprise/admin - in production, fetch from API/session
  const userTier = "enterprise"
  const isAdmin = true

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      title: "Total Revenue",
      value: "$24,563",
      change: "+12.5%",
      trend: "up",
      icon: BillingIcon,
      gradient: "from-green-400 via-emerald-400 to-teal-500"
    },
    {
      title: "Content Generated", 
      value: "1,234",
      change: "+23.1%",
      trend: "up",
      icon: GeneratorIcon,
      gradient: "from-pink-400 via-purple-400 to-indigo-500"
    },
    {
      title: "AI Models Active",
      value: "47",
      change: "+8.7%",
      trend: "up", 
      icon: ModelsIcon,
      gradient: "from-cyan-400 via-blue-400 to-indigo-500"
    },
    {
      title: "Platform Reach",
      value: "12.8M",
      change: "+15.3%",
      trend: "up",
      icon: PlatformsIcon,
      gradient: "from-yellow-400 via-orange-400 to-red-500"
    }
  ]

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Welcome back, Master Admin
            </h1>
            <p className="text-gray-400 mt-2">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-3">
            <Badge className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg">
              <AIToolsIcon className="mr-2 h-4 w-4" />
              Enterprise • Unlimited
            </Badge>
            {isAdmin && (
              <Badge className="px-4 py-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white border-0 shadow-lg animate-pulse">
                <WorkbenchIcon className="mr-2 h-4 w-4" />
                Master Access
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-950/80 backdrop-blur-xl border-gray-700/50 hover:bg-gray-950/90 transition-all duration-300 shadow-2xl hover:shadow-purple-500/10 group relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-7 w-7 text-white drop-shadow-lg" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
                </div>
                
                {/* Neo-retro grid pattern overlay */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <div className="w-full h-full" style={{
                    backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-400">
                Start creating content with one click
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Button className="h-28 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700 text-white shadow-2xl hover:shadow-pink-500/25 hover:scale-105 transition-all duration-300 group">
                  <GeneratorIcon className="h-8 w-8 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Generate Content</span>
                </Button>
                <Button className="h-28 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-700 text-white shadow-2xl hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-300 group">
                  <PlatformsIcon className="h-8 w-8 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Manage Platforms</span>
                </Button>
                <Button className="h-28 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-600 hover:from-violet-600 hover:via-purple-600 hover:to-pink-700 text-white shadow-2xl hover:shadow-violet-500/25 hover:scale-105 transition-all duration-300 group">
                  <AnalyticsIcon className="h-8 w-8 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-400">
                Your latest content and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/50">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    <div className="flex-1">
                      <p className="text-white font-medium">Generated new content</p>
                      <p className="text-sm text-gray-400">2 hours ago</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-0">
                      Completed
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <div>
          <SystemHealth />
        </div>
      </div>
    </div>
  )
}