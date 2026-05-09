"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Calendar as CalendarIcon, Clock, Plus, Trash2 } from "lucide-react"
import { scheduleVideoAction, getScheduledVideos, getUnscheduledVideos } from "@/app/actions/calendar"
import { toast } from "sonner"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [scheduledVideos, setScheduledVideos] = useState<unknown[]>([])
  const [unscheduledVideos, setUnscheduledVideos] = useState<unknown[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVideoId, setSelectedVideoId] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchData = async () => {
    const [scheduled, unscheduled] = await Promise.all([
      getScheduledVideos(),
      getUnscheduledVideos()
    ])
    setScheduledVideos(scheduled)
    setUnscheduledVideos(unscheduled)
  }

  useEffect(() => {
    void fetchData()
  }, [])

  const handleSchedule = async () => {
    if (!selectedVideoId || !date) {
      toast.error("Please select a video and date")
      return
    }

    setLoading(true)
    try {
      const result = await scheduleVideoAction(selectedVideoId, date)
      if (result.success) {
        toast.success("Video scheduled successfully!")
        setIsDialogOpen(false)
        fetchData()
      } else {
        toast.error(result.error || "Failed to schedule video")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleUnschedule = async (videoId: string) => {
    try {
      const result = await scheduleVideoAction(videoId, null)
      if (result.success) {
        toast.success("Schedule removed")
        fetchData()
      }
    } catch (error) {
      toast.error("Failed to remove schedule")
    }
  }

  const videosOnSelectedDate = scheduledVideos.filter(v => 
    v.publishDate && format(new Date(v.publishDate), "yyyy-MM-dd") === format(date ?? new Date(), "yyyy-MM-dd")
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-purple-100 bg-clip-text text-transparent">
            Publishing Calendar
          </h1>
          <p className="text-white/60">Schedule your videos for publishing and get reminders.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-none rounded-full px-6">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Video
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0a0a0a] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Schedule a Video</DialogTitle>
              <DialogDescription className="text-white/50">
                Choose a video and a date to publish it.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Select Video</label>
                <Select onValueChange={setSelectedVideoId}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Choose a video..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                    {unscheduledVideos.length > 0 ? (
                      unscheduledVideos.map(video => (
                        <SelectItem key={video.videoId} value={video.videoId}>
                          {video.title || video.prompt.slice(0, 30) + "..."}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-sm text-white/40">No unscheduled videos</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Pick Date</label>
                <div className="border border-white/10 rounded-lg p-2 bg-white/5">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
            <Button 
              onClick={handleSchedule} 
              disabled={loading || !selectedVideoId}
              className="w-full bg-white text-black hover:bg-white/90"
            >
              {loading ? "Scheduling..." : "Confirm Schedule"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-purple-400" />
                Calendar View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md bg-transparent"
                modifiers={{
                  scheduled: (d) => scheduledVideos.some(v => 
                    v.publishDate && format(new Date(v.publishDate), "yyyy-MM-dd") === format(d, "yyyy-MM-dd")
                  )
                }}
                modifiersStyles={{
                  scheduled: { fontWeight: "bold", border: "1px solid rgba(168, 85, 247, 0.4)", borderRadius: "100%" }
                }}
              />
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-sm">Reminders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scheduledVideos.length > 0 ? (
                scheduledVideos.slice(0, 3).map(v => (
                  <div key={v.videoId} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="size-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                      <Clock className="size-5 text-purple-400" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-medium text-white truncate">{v.title || "Untitled Video"}</p>
                      <p className="text-[10px] text-white/40">{v.publishDate ? format(new Date(v.publishDate), "MMM dd, yyyy") : ""}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/20 text-center py-4">No upcoming publish dates</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {date ? format(date, "MMMM dd, yyyy") : "Selected Date"}
            </h2>
            <Badge variant="outline" className="text-purple-400 border-purple-500/30 bg-purple-500/5">
              {videosOnSelectedDate.length} {videosOnSelectedDate.length === 1 ? 'Video' : 'Videos'}
            </Badge>
          </div>

          <div className="grid gap-4">
            {videosOnSelectedDate.length > 0 ? (
              videosOnSelectedDate.map(video => (
                <div 
                  key={video.videoId} 
                  className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="relative size-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt="" className="object-cover w-full h-full" />
                    ) : (
                      <Video className="size-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-medium text-white">{video.title || "Untitled Video"}</h3>
                    <p className="text-sm text-white/40 line-clamp-1">{video.prompt}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleUnschedule(video.videoId)}
                    className="text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-full"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 rounded-3xl bg-white/[0.02] border border-dashed border-white/10">
                <CalendarIcon className="size-12 text-white/5 mb-4" />
                <p className="text-white/40 font-medium">Nothing scheduled for this day</p>
                <p className="text-xs text-white/20 mt-1">Select another date or add a new video</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
