"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function TooltipCredits({ credits }: { credits: number }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary" size="sm" className="rounded-full">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="thunderbolt"
              style={{ color: "#FFD700" }}
            >
              <path d="M13.2319 2.28681C13.5409 2.38727 13.75 2.6752 13.75 3.00005V9.25005H19C19.2821 9.25005 19.5403 9.40834 19.6683 9.65972C19.7963 9.9111 19.7725 10.213 19.6066 10.4412L11.6066 21.4412C11.4155 21.7039 11.077 21.8137 10.7681 21.7133C10.4591 21.6128 10.25 21.3249 10.25 21.0001V14.7501H5C4.71791 14.7501 4.45967 14.5918 4.33167 14.3404C4.20366 14.089 4.22753 13.7871 4.39345 13.5589L12.3935 2.55892C12.5845 2.2962 12.923 2.18635 13.2319 2.28681Z" />
            </svg>
            {credits}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="rounded-2xl bg-gradient-to-br from-white to-neutral-300 px-4 py-2 text-black shadow-xl"
        >
          <div className="flex flex-col items-center gap-2 p-1">
            <span>You currently have {credits} credits left</span>
            <Button asChild className="h-7 w-[90px] rounded-full bg-gradient-to-br from-[#a855f7] to-[#6b21a8] text-xs font-medium text-white hover:opacity-80">
              <Link href="/pricing">Pricing</Link>
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}