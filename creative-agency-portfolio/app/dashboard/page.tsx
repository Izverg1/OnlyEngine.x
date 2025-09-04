"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SystemHealth } from "@/components/system-health"
import { motion } from "framer-motion"
import { 
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Zap,
  ArrowUp,
  ArrowDown
} from "lucide-react"

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
      icon: DollarSign,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Content Generated",
      value: "1,234",
      change: "+23.1%",
      trend: "up",
      icon: Sparkles,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Active Users",
      value: "8,421",
      change: "+5.2%",
      trend: "up",
      icon: Users,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Engagement Rate",
      value: "24.5%",
      change: "-2.1%",
      trend: "down",
      icon: Activity,
      color: "from-yellow-500 to-orange-500"
    }
  ]

  return (
    <div className="p-8">
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
            <Badge className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              <Zap className="mr-2 h-4 w-4" />
              Enterprise • Unlimited
            </Badge>
            {isAdmin && (
              <Badge className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white border-0">
                👑 Admin Access
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
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:bg-gray-900/70 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400 mt-1">{stat.title}</p>
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Sparkles className="h-6 w-6" />
                  <span>Generate</span>
                </Button>
                <Button className="h-24 flex flex-col items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white">
                  <Users className="h-6 w-6" />
                  <span>Audience</span>
                </Button>
                <Button className="h-24 flex flex-col items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white">
                  <TrendingUp className="h-6 w-6" />
                  <span>Analytics</span>
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