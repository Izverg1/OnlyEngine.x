"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  Sparkles
} from "lucide-react"
import {
  WorkbenchIcon,
  GeneratorIcon,
  ContentLibraryIcon,
  DistributionIcon,
  AnalyticsIcon,
  AIToolsIcon,
  SettingsIcon,
  BillingIcon,
  HelpIcon,
  LogoutIcon,
  ModelsIcon,
  PlatformsIcon,
  DataProcessedIcon,
  APICallsIcon
} from "@/components/workbench-icons"
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
    id: "workbench",
    label: "Workbench",
    icon: WorkbenchIcon,
    href: "/dashboard",
    color: "text-cyan-400"
  },
  {
    id: "generator",
    label: "Generator",
    icon: GeneratorIcon,
    color: "text-pink-400",
    submenu: [
      { id: "ai-create", label: "AI Create", icon: Sparkles, href: "/dashboard/generate/ai" },
      { id: "templates", label: "Templates", icon: ModelsIcon, href: "/dashboard/generate/templates" },
      { id: "batch", label: "Batch Process", icon: DataProcessedIcon, href: "/dashboard/generate/batch" },
      { id: "workflow", label: "Workflows", icon: APICallsIcon, href: "/dashboard/generate/workflow" }
    ]
  },
  {
    id: "content",
    label: "Content",
    icon: ContentLibraryIcon,
    color: "text-orange-400",
    badge: 12,
    submenu: [
      { id: "library", label: "Library", icon: ContentLibraryIcon, href: "/dashboard/content/library" },
      { id: "collections", label: "Collections", icon: ModelsIcon, href: "/dashboard/content/collections" },
      { id: "drafts", label: "Drafts", icon: DataProcessedIcon, href: "/dashboard/content/drafts", badge: 3 },
      { id: "trash", label: "Trash", icon: LogoutIcon, href: "/dashboard/content/trash" }
    ]
  },
  {
    id: "distribute",
    label: "Distribute",
    icon: DistributionIcon,
    color: "text-purple-400",
    submenu: [
      { id: "schedule", label: "Schedule", icon: APICallsIcon, href: "/dashboard/distribute/schedule" },
      { id: "platforms", label: "Platforms", icon: PlatformsIcon, href: "/dashboard/distribute/platforms" },
      { id: "targeting", label: "Targeting", icon: DistributionIcon, href: "/dashboard/distribute/targeting" },
      { id: "automation", label: "Automation", icon: AIToolsIcon, href: "/dashboard/distribute/automation" }
    ]
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: AnalyticsIcon,
    color: "text-blue-400",
    submenu: [
      { id: "overview", label: "Overview", icon: WorkbenchIcon, href: "/dashboard/analytics/overview" },
      { id: "performance", label: "Performance", icon: AnalyticsIcon, href: "/dashboard/analytics/performance" },
      { id: "audience", label: "Audience", icon: PlatformsIcon, href: "/dashboard/analytics/audience" },
      { id: "revenue", label: "Revenue", icon: BillingIcon, href: "/dashboard/analytics/revenue" }
    ]
  },
  {
    id: "ai-tools",
    label: "AI Tools",
    icon: AIToolsIcon,
    color: "text-emerald-400",
    submenu: [
      { id: "enhance", label: "Enhance", icon: GeneratorIcon, href: "/dashboard/ai/enhance" },
      { id: "analyze", label: "Analyze", icon: AnalyticsIcon, href: "/dashboard/ai/analyze" },
      { id: "optimize", label: "Optimize", icon: AIToolsIcon, href: "/dashboard/ai/optimize" },
      { id: "models", label: "Models", icon: ModelsIcon, href: "/dashboard/ai/models" }
    ]
  }
]

const bottomMenuItems: MenuItem[] = [
  {
    id: "settings",
    label: "Settings",
    icon: SettingsIcon,
    href: "/dashboard/settings",
    color: "text-teal-400"
  },
  {
    id: "billing",
    label: "Billing",
    icon: BillingIcon,
    href: "/dashboard/billing",
    color: "text-yellow-400"
  },
  {
    id: "help",
    label: "Help",
    icon: HelpIcon,
    href: "/dashboard/help",
    color: "text-pink-400"
  }
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 })
  const submenuRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseEnter = (itemId: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    
    const rect = event.currentTarget.getBoundingClientRect()
    setSubmenuPosition({
      top: rect.top,
      left: 80 // Always show submenu to the right of collapsed sidebar
    })
    setActiveSubmenu(itemId)
  }

  const handleSidebarMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsExpanded(true)
  }

  const handleSidebarMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false)
      setActiveSubmenu(null)
    }, 150)
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
          "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative",
          isActive 
            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg" 
            : "text-gray-400 hover:text-white hover:bg-white/5",
          isSubmenu && "text-sm py-2",
          !isExpanded && !isSubmenu && "justify-center"
        )}
        title={!isExpanded ? item.label : undefined}
      >
        <item.icon className={cn(
          "h-5 w-5 flex-shrink-0 transition-colors",
          isActive ? "text-blue-400" : item.color || "text-gray-400",
          "group-hover:text-white"
        )} />
        
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 text-left whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {isExpanded && item.badge && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full"
          >
            {item.badge}
          </motion.span>
        )}

        {isExpanded && hasSubmenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </motion.div>
        )}

        {/* Collapsed state badge */}
        {!isExpanded && item.badge && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {item.badge}
          </span>
        )}

        {/* Contextual submenu indicator for collapsed state */}
        {!isExpanded && hasSubmenu && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-pulse" />
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Sidebar */}
      <motion.div
        initial={{ width: 80 }}
        animate={{ width: isExpanded ? 280 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
        className="fixed left-0 top-0 h-full bg-gray-950/98 backdrop-blur-xl border-r border-gray-800 z-40 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800/50">
          <div className={cn(
            "flex items-center transition-all duration-300",
            isExpanded ? "justify-between" : "justify-center"
          )}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-lg opacity-70" />
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="font-bold text-white">OnlyEngine.x</h2>
                    <p className="text-xs text-gray-400">AI Platform</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </div>

        {/* Bottom Menu */}
        <div className="border-t border-gray-800/50 p-3 space-y-1">
          {bottomMenuItems.map(item => renderMenuItem(item))}
          
          {/* User Profile */}
          <div className="pt-3 border-t border-gray-800/50 mt-3">
            <div className={cn(
              "flex items-center gap-3 px-3 py-2 transition-all duration-300",
              !isExpanded && "justify-center"
            )}>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
                MA
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1"
                  >
                    <p className="text-sm font-medium text-white">Master Admin</p>
                    <p className="text-xs text-gray-400">Enterprise</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {isExpanded && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
                  >
                    <LogoutIcon className="h-4 w-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Contextual Submenu */}
      <AnimatePresence>
        {activeSubmenu && !isExpanded && (
          <motion.div
            ref={submenuRef}
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onMouseEnter={handleSubmenuMouseEnter}
            onMouseLeave={handleSubmenuMouseLeave}
            className="fixed z-50 bg-gray-900/98 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-3 min-w-[240px] max-w-[280px]"
            style={{
              top: `${submenuPosition.top}px`,
              left: `${submenuPosition.left + 10}px`
            }}
          >
            {/* Submenu Header */}
            <div className="px-2 py-1 mb-2">
              <h3 className="text-white font-semibold text-sm">
                {menuItems.find(item => item.id === activeSubmenu)?.label}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Quick Actions</p>
            </div>
            
            {/* Submenu Items */}
            <div className="space-y-1">
              {menuItems
                .find(item => item.id === activeSubmenu)
                ?.submenu?.map((subItem, index) => (
                  <motion.div
                    key={subItem.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <Link
                      href={subItem.href || '#'}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/8 transition-all duration-200 group"
                    >
                      <subItem.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <div className="flex-1">
                        <span className="block text-sm font-medium">{subItem.label}</span>
                        <span className="text-xs text-gray-500 block">
                          {subItem.id === 'ai-create' && 'Generate with AI'}
                          {subItem.id === 'templates' && 'Pre-made designs'}
                          {subItem.id === 'batch' && 'Bulk operations'}
                          {subItem.id === 'workflow' && 'Automated flows'}
                          {subItem.id === 'library' && 'Your content'}
                          {subItem.id === 'collections' && 'Organized sets'}
                          {subItem.id === 'drafts' && 'Work in progress'}
                          {subItem.id === 'trash' && 'Deleted items'}
                          {subItem.id === 'schedule' && 'Time your posts'}
                          {subItem.id === 'platforms' && 'Social networks'}
                          {subItem.id === 'targeting' && 'Audience focus'}
                          {subItem.id === 'automation' && 'Smart posting'}
                          {subItem.id === 'overview' && 'Performance summary'}
                          {subItem.id === 'performance' && 'Detailed metrics'}
                          {subItem.id === 'audience' && 'User insights'}
                          {subItem.id === 'revenue' && 'Financial data'}
                          {subItem.id === 'enhance' && 'Improve quality'}
                          {subItem.id === 'analyze' && 'Deep insights'}
                          {subItem.id === 'optimize' && 'Better performance'}
                          {subItem.id === 'models' && 'AI configurations'}
                        </span>
                      </div>
                      {subItem.badge && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full font-medium"
                        >
                          {subItem.badge}
                        </motion.span>
                      )}
                    </Link>
                  </motion.div>
                ))}
            </div>
            
            {/* Arrow pointing to sidebar */}
            <div className="absolute left-0 top-6 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-700/50 transform -translate-x-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}