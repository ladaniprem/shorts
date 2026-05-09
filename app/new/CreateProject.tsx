"use client"

import { Button } from '@/components/ui/button'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import React, { useState } from 'react'
import { Cover } from "@/components/ui/cover";
import { ShineBorder } from '@/components/ui/shine-border';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import TooltipCredits from '../components/creditsButton'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { createVideo } from '../actions/create'
import { MultiStepLoader as Loader } from '@/components/ui/multi-step-loader'
import { LANGUAGE_VOICES, DEFAULT_LANGUAGE } from '@/lib/voices'
import { Sparkles, AlertCircle } from 'lucide-react'
import { PhotoShowcase } from '@/components/PhotoShowcase'
import { toast } from 'sonner'


const CreateProject = ({ user, credits }: { user: string | null; credits: number }) => {
  const loadingStates = [
    { text: "Starting Pipeline" },
    { text: "Generating Script" },
    { text: "Generating Images" },
    { text: "Generating Voice" },
    { text: "Generating Captions" },
    { text: "Finalizing Video" },
    { text: "Completed" }
  ]
  const router = useRouter()
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
    "who is mrbeast?",
    "who is elon musk?",
    "who is jeff bezos?",
    "who is bill gates?",
    "who is mark zuckerberg?",
  ];

  const [prompt, setPrompt] = useState("")
  const [selectedVoice, setSelectedVoice] = useState(
    LANGUAGE_VOICES.find(v => v.language === DEFAULT_LANGUAGE)!
  )
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showCreditsDialog, setShowCreditsDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<number | undefined>(undefined)

  // voiceId = "VoiceName|Language" e.g. "Aoede|English" or "Kore|Hindi"
  const voiceId = `${selectedVoice.id}|${selectedVoice.language}`

  const handleCreateVideo = async () => {
    setIsLoading(true)
    toast.info("Generation started! This usually takes about 60 seconds.")

    try {
      const result = await createVideo(prompt, voiceId)

      if (result?.videoId) {
        const pollInterval = setInterval(async () => {
          try {
            const response = await fetch(`/api/video-status/${result.videoId}`)
            const data = await response.json()

            if (data.currentStep !== undefined) {
              setCurrentStep(data.currentStep)
            }

            if (data.completed) {
              clearInterval(pollInterval)
              toast.success("Video generated successfully!")
              router.replace(`/videos/${result.videoId}`)
            } else if (data.failed) {
              clearInterval(pollInterval)
              setIsLoading(false)
              setCurrentStep(undefined)
              toast.error("Video generation failed. Please try again with a different prompt.")
            }
          } catch (err) {
            console.error('Polling error:', err)
          }
        }, 5000)
      } else {
        setIsLoading(false)
        toast.error("Failed to initiate video creation.")
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Creation error:', error)
      toast.error("An unexpected error occurred.")
    }
  }

  return (
    <div className='w-full min-h-screen flex flex-col bg-black overflow-x-hidden'>
      {/* ... previous content ... */}
      <div className='flex-1 flex flex-col'>
        {
          !user &&
          <div className='flex justify-end gap-1 mr-7 mt-5'>
            <SignInButton>
              <Button className='bg-black border border-white/15 text-white rounded-full mx-2 hover:bg-white/5 transition-all duration-150 cursor-pointer px-6 py-2 text-[11px] font-bold uppercase tracking-widest'>
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="px-6 py-2 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white text-[11px] font-bold tracking-widest uppercase hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all cursor-pointer border border-white/10">
                Sign up
              </Button>
            </SignUpButton>
          </div>
        }
        {user &&
          <div className='flex justify-end mr-7 mt-5 items-center gap-4'>
            <TooltipCredits credits={credits} />
            <Link href={"/dashboard"}>
              <Button className="px-6 py-2 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white text-[11px] font-bold tracking-widest uppercase hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all cursor-pointer border border-white/10">
                Dashboard
              </Button>
            </Link>
          </div>
        }

        <Loader
          key={isLoading ? 'loading' : 'idle'}
          loadingStates={loadingStates}
          loading={isLoading}
          currentStep={currentStep}
          duration={10000}
          loop={false}
        />

        <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
          Generate realistic short
          <div className='h-6'></div>
          <Cover>warp speed</Cover>
        </h1>

        <div className='flex flex-col items-center justify-center mt-12 mb-24 gap-12'>
          <div className="flex flex-col items-center gap-4">
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold flex items-center gap-2">
              <Sparkles className="size-3 text-purple-500" />
              Select Voice
            </label>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
              {LANGUAGE_VOICES.map((voice) => {
                const isSelected = selectedVoice.id === voice.id && selectedVoice.language === voice.language
                return (
                  <button
                    key={`${voice.id}-${voice.language}`}
                    onClick={() => setSelectedVoice(voice)}
                    className={`flex flex-col items-center gap-1 px-6 py-3 rounded-2xl border transition-all duration-200 cursor-pointer min-w-[120px] ${
                      isSelected
                        ? "border-purple-500 bg-purple-600/20 shadow-[0_0_16px_rgba(168,85,247,0.35)] text-white"
                        : "border-white/10 bg-black/30 text-neutral-400 hover:border-purple-500/40 hover:text-white"
                    }`}
                  >
                    <span className="text-xl">{voice.flag}</span>
                    <span className="text-xs font-bold tracking-wide">{voice.language}</span>
                    <span className="text-[9px] opacity-60">{voice.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className='relative rounded-3xl w-full max-w-[500px] overflow-hidden'>
            <ShineBorder
              className='z-10'
              shineColor={["#a855f7", "#9333ea", "#7e22ce", "#a855f7"]}
            />
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={(e) => setPrompt(e.target.value)}
              onSubmit={(e) => {
                e.preventDefault()
                if (!user) return setShowLoginDialog(true)
                if (credits < 1) return setShowCreditsDialog(true)
                handleCreateVideo()
              }}
            />
          </div>
        </div>

        <PhotoShowcase />
      </div>

      {/* Dialogs */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className='sm:max-w-[425px] border-white/10 bg-black text-white'>
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription className="text-neutral-400">Please sign in to create your AI shorts.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-center sm:justify-center">
            <SignInButton mode="modal">
              <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/5 text-white">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white">Sign Up</Button>
            </SignUpButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
        <DialogContent className='sm:max-w-[425px] border-white/10 bg-black text-white'>
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Out of Credits
            </DialogTitle>
            <DialogDescription className="text-neutral-400">
              You need at least 1 credit to generate a video.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="w-full rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-widest uppercase text-xs"
              onClick={() => {
                router.push('/pricing')
                setShowCreditsDialog(false)
              }}
            >
              Get More Credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateProject
