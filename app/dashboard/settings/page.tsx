"use client"

import { UserProfile } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme } = useTheme()
  
  return (
    <div className="flex justify-center items-start pt-4 pb-20">
      <UserProfile 
        routing="hash"
        appearance={{
          baseTheme: theme === 'dark' ? dark : undefined,
          elements: {
            card: "bg-transparent shadow-none border-none",
            navbar: "hidden",
            pageScrollBox: "p-0",
            headerTitle: theme === 'dark' ? "text-white" : "text-black",
            headerSubtitle: theme === 'dark' ? "text-white/60" : "text-black/60",
          }
        }}
      />
    </div>
  )
}
