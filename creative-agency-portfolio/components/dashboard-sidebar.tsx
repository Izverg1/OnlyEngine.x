"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  LayoutDashboard,
  Wand2,
  Image,
  Calendar,
  BarChart3,
  Settings,
  Users,
  CreditCard,
  Bell,
  HelpCircle,
  ChevronRight,
  LogOut,
  Palette,
  Layers,
  Target,
  Zap,
  Database,
  GitBranch,
  Brain,
  Workflow,
  Shield,
  Globe,
  Package,
  FileText,
  Activity,
  ChevronLeft,
  Menu,
  X,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItem {
  id: string
  label: string
  icon: React.ElementType
  href?: string
  badge?: string | number
  submenu?: MenuItem[]
  color?: string
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-blue-400"
  },
  {
    id: "generate",
    label: "Generate",
    icon: Wand2,
    color: "text-purple-400",
    submenu: [
      { id: "ai-create", label: "AI Create", icon: Sparkles, href: "/dashboard/generate/ai" },
      { id: "templates", label: "Templates", icon: Palette, href: "/dashboard/generate/templates" },
      { id: "batch", label: "Batch Process", icon: Layers, href: "/dashboard/generate/batch" },
      { id: "workflow", label: "Workflows", icon: Workflow, href: "/dashboard/generate/workflow" }
    ]
  },
  {
    id: "content",
    label: "Content",
    icon: Image,
    color: "text-green-400",
    badge: 12,
    submenu: [
      { id: "library", label: "Library", icon: Package, href: "/dashboard/content/library" },
      { id: "collections", label: "Collections", icon: Layers, href: "/dashboard/content/collections" },
      { id: "drafts", label: "Drafts", icon: FileText, href: "/dashboard/content/drafts", badge: 3 },
      { id: "trash", label: "Trash", icon: X, href: "/dashboard/content/trash" }
    ]
  },
  {
    id: "distribute",
    label: "Distribute",
    icon: Globe,
    color: "text-cyan-400",
    submenu: [
      { id: "schedule", label: "Schedule", icon: Calendar, href: "/dashboard/distribute/schedule" },
      { id: "platforms", label: "Platforms", icon: Globe, href: "/dashboard/distribute/platforms" },
      { id: "targeting", label: "Targeting", icon: Target, href: "/dashboard/distribute/targeting" },
      { id: "automation", label: "Automation", icon: Zap, href: "/dashboard/distribute/automation" }
    ]
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    color: "text-yellow-400",
    submenu: [
      { id: "overview", label: "Overview", icon: Activity, href: "/dashboard/analytics/overview" },
      { id: "performance", label: "Performance", icon: TrendingUp, href: "/dashboard/analytics/performance" },
      { id: "audience", label: "Audience", icon: Users, href: "/dashboard/analytics/audience" },
      { id: "revenue", label: "Revenue", icon: CreditCard, href: "/dashboard/analytics/revenue" }
    ]
  },
  {
    id: "ai-tools",
    label: "AI Tools",
    icon: Brain,
    color: "text-pink-400",
    submenu: [
      { id: "enhance", label: "Enhance", icon: Sparkles, href: "/dashboard/ai/enhance" },
      { id: "analyze", label: "Analyze", icon: Brain, href: "/dashboard/ai/analyze" },
      { id: "optimize", label: "Optimize", icon: Zap, href: "/dashboard/ai/optimize" },
      { id: "models", label: "Models", icon: Database, href: "/dashboard/ai/models" }
    ]
  }
]

const bottomMenuItems: MenuItem[] = [
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-400"
  },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    href: "/dashboard/billing",
    color: "text-gray-400"
  },
  {
    id: "help",
    label: "Help",
    icon: HelpCircle,
    href: "/dashboard/help",
    color: "text-gray-400"
  }
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 })
  const submenuRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseEnter = (itemId: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    
    const rect = event.currentTarget.getBoundingClientRect()
    setSubmenuPosition({
      top: rect.top,
      left: collapsed ? 80 : 260
    })
    setActiveSubmenu(itemId)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null)
    }, 300)
  }

  const handleSubmenuMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const handleSubmenuMouseLeave = () => {
    setActiveSubmenu(null)
  }

  const renderMenuItem = (item: MenuItem, isSubmenu = false) => {
    const isActive = pathname === item.href || pathname?.startsWith(item.href || '')
    const hasSubmenu = item.submenu && item.submenu.length > 0

    return (
      <Link
        key={item.id}
        href={item.href || '#'}
        onMouseEnter={(e) => !isSubmenu && hasSubmenu && handleMouseEnter(item.id, e)}
        onMouseLeave={!isSubmenu ? handleMouseLeave : undefined}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
          isActive 
            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30" 
            : "text-gray-400 hover:text-white hover:bg-white/5",
          isSubmenu && "text-sm"
        )}
      >
        <item.icon className={cn(
          "h-5 w-5 flex-shrink-0 transition-colors",
          isActive ? "text-blue-400" : item.color || "text-gray-400",
          "group-hover:text-white"
        )} />
        
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1 text-left"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {!collapsed && item.badge && (
          <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">
            {item.badge}
          </span>
        )}

        {!collapsed && hasSubmenu && (
          <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
        )}

        {/* Collapsed state badge */}
        {collapsed && item.badge && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Sidebar */}
      <motion.div
        initial={{ width: 260 }}
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full bg-gray-950/95 backdrop-blur-xl border-r border-gray-800 z-40 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {!collapsed ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-lg opacity-70" />
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="font-bold text-white">OnlyEngine.x</h2>
                  <p className="text-xs text-gray-400">AI Platform</p>
                </div>
              </div>
            ) : (
              <div className="mx-auto">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
            )}
            
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Main Menu */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </div>

        {/* Bottom Menu */}
        <div className="border-t border-gray-800 p-3 space-y-1">
          {bottomMenuItems.map(item => renderMenuItem(item))}
          
          {/* User Profile */}
          <div className="pt-3 border-t border-gray-800 mt-3">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                MA
              </div>
              {!collapsed && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Master Admin</p>
                  <p className="text-xs text-gray-400">Enterprise</p>
                </div>
              )}
              {!collapsed && (
                <button className="text-gray-400 hover:text-white transition-colors">
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Submenu */}
      <AnimatePresence>
        {activeSubmenu && (
          <motion.div
            ref={submenuRef}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={handleSubmenuMouseEnter}
            onMouseLeave={handleSubmenuMouseLeave}
            className="fixed z-50 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl p-2 min-w-[200px]"
            style={{
              top: `${submenuPosition.top}px`,
              left: `${submenuPosition.left}px`
            }}
          >
            {menuItems
              .find(item => item.id === activeSubmenu)
              ?.submenu?.map(subItem => (
                <Link
                  key={subItem.id}
                  href={subItem.href || '#'}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <subItem.icon className="h-4 w-4" />
                  <span className="flex-1">{subItem.label}</span>
                  {subItem.badge && (
                    <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                      {subItem.badge}
                    </span>
                  )}
                </Link>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}