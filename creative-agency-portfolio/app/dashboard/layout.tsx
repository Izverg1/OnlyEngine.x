import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      <DashboardSidebar />
      
      {/* Main Content Area with margin for minimized sidebar */}
      <div className="ml-[80px] transition-all duration-300">
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}