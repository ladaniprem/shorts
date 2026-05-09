import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <SidebarInset className="flex flex-col bg-transparent">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4 sticky top-0 z-10 bg-background/40 backdrop-blur-md">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-border" />
              <div className="flex flex-1 items-center justify-between">
                <nav aria-label="Breadcrumb">
                  <ol className="flex items-center gap-3 text-sm font-medium">
                    <li className="flex items-center gap-2 text-foreground">
                      <div className="size-5 relative rounded-md overflow-hidden bg-accent/5 border border-border p-0.5">
                        <img src="/ai-shorts-logo.png" alt="" className="w-full h-full object-contain" />
                      </div>
                      AI Shorts
                    </li>
                    <li className="text-muted-foreground/20">/</li>
                    <li className="text-muted-foreground">Dashboard</li>
                  </ol>
                </nav>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
