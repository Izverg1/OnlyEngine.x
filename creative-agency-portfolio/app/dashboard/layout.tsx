import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      <DashboardSidebar />
      
      {/* Main Content Area with margin for sidebar */}
      <div className="ml-[260px] transition-all duration-300">
        {children}
      </div>
    </div>
  )
}