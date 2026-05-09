"use client"

import * as React from "react"
import {
  Calendar,
  LayoutDashboard,
  Image as ImageIcon,
  Video,
  Settings,
  ChevronRight,
  Plus,
  Type,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"
import { ModeToggle } from "./mode-toggle"

import Image from "next/image"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create Short",
    url: "/new",
    icon: Plus,
  },
  {
    title: "Thumbnails",
    url: "/dashboard/thumbnails",
    icon: ImageIcon,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Long-to-Short",
    url: "/dashboard/converter",
    icon: Video,
  },
  {
    title: "Titles",
    url: "/dashboard/titles",
    icon: Type,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-neutral-950">
      <SidebarHeader className="h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-70">
          <div className="relative size-8 rounded-lg overflow-hidden flex items-center justify-center bg-white/5 border border-white/10 shadow-sm">
            <Image 
              src="/ai-shorts-logo.png" 
              alt="Logo" 
              width={20} 
              height={20} 
              className="object-contain"
            />
          </div>
          <span className="font-bold tracking-tight text-white group-data-[collapsible=icon]:hidden">
            AI Shorts
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 px-3 mb-2">Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className={`
                      h-10 px-3 rounded-lg transition-colors relative overflow-hidden group
                      ${pathname === item.url 
                        ? "bg-white/5 text-white" 
                        : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"}
                    `}
                  >
                    <Link href={item.url} className="flex items-center gap-3 w-full">
                      <item.icon className={`size-4 ${pathname === item.url ? "text-violet-400" : "text-neutral-500 group-hover:text-neutral-300"} transition-colors`} />
                      <span className="font-medium text-sm tracking-tight">{item.title}</span>
                      
                      {pathname === item.url && (
                        <div className="absolute left-0 w-1 h-4 bg-violet-500 rounded-r-full" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 bg-neutral-950">
        <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-2xl p-2 px-3">
          <div className="flex items-center gap-3">
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  avatarBox: "size-8 rounded-lg"
                }
              }}
            />
            <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
              <span className="truncate text-xs font-semibold text-white">Account</span>
            </div>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <ModeToggle />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
