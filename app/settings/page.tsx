"use client";

import { useState, useEffect } from "react";
import { UserProfile, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  CreditCard,
  Zap,
  RefreshCw,
  Check,
  X,
  Crown,
  Play,
  BarChart3,
} from "lucide-react";
import { UpgradeModal } from "@/components/UpgradeModal";
import { PRO_PLAN, FREE_PLAN } from "@/lib/plan-config";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuraBackground } from "@/components/AuraBackground";
import { ScrambleText } from "@/components/ScrambleText";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Mock usage data for AI Shorts
  const [usage] = useState({
    isPro: false,
    plan: "Starter",
    shortsUsed: 3,
    shortsLimit: 5,
    storageUsed: 1.2,
    storageLimit: 5,
    resetsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  });

  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 className="w-8 h-8 text-neutral-500 animate-spin" />
      </div>
    );
  }

  // Feature comparison data for AI Shorts
  const featureComparison = [
    {
      feature: "Monthly AI Shorts",
      free: `5`,
      pro: `100`,
    },
    {
      feature: "Export Resolution",
      free: "720p",
      pro: "4K HD",
    },
    {
      feature: "AI Voice Quality",
      free: "Standard",
      pro: "Premium + Neural",
    },
    { feature: "No Watermark", free: false, pro: true },
    { feature: "Viral Trend AI", free: false, pro: true },
    { feature: "Custom Branding", free: false, pro: true },
    { feature: "Priority Rendering", free: false, pro: true },
  ];

  return (
    <div className="relative min-h-screen dark bg-black noise-overlay font-sans text-neutral-200">
      <AuraBackground />
      <div className="fixed inset-0 pointer-events-none z-0 technical-grid opacity-30"></div>
      
      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20 space-y-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tighter">
            <ScrambleText text="Settings" speed={30} />
          </h1>
          <p className="text-neutral-400 font-light">
            Manage your neural identity and platform protocols.
          </p>
        </div>

        {/* Subscription Section */}
        <Card className="bg-neutral-900/40 border-white/10 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-2xl">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl text-white flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Usage & Quotas
            </CardTitle>
            <CardDescription className="text-neutral-500">
              Real-time monitoring of your video generation cycles.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono mb-2">
                    Active Protocol
                  </p>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-medium text-white">
                      {usage.plan} Plan
                    </h3>
                    {usage.isPro ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20 flex items-center gap-2">
                        <Crown className="w-3 h-3" />
                        ACTIVE
                      </span>
                    ) : (
                        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-mono border border-purple-500/20 flex items-center gap-2">
                        STAGING
                      </span>
                    )}
                  </div>
                </div>

                {!usage.isPro && (
                  <Button
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-widest h-12 px-8 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  >
                    <Zap className="w-4 h-4 mr-2 fill-black" />
                    Protocol Upgrade
                  </Button>
                )}
              </div>

              {/* Usage Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {/* Shorts Usage */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-400 uppercase tracking-widest">AI Shorts</span>
                    <span className="text-white">
                      {usage.shortsUsed} / {usage.shortsLimit}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full transition-all duration-1000"
                      style={{
                        width: `${(usage.shortsUsed / usage.shortsLimit) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Storage Usage */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-400 uppercase tracking-widest">Neural Cache (GB)</span>
                    <span className="text-white">
                      {usage.storageUsed} / {usage.storageLimit}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-1000"
                      style={{
                        width: `${(usage.storageUsed / usage.storageLimit) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <p className="text-[10px] text-neutral-600 font-mono flex items-center gap-2">
                <RefreshCw className="w-3 h-3" />
                Next reset cycle scheduled for {new Date(usage.resetsAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Feature Comparison */}
        <Card className="bg-neutral-900/40 border-white/10 backdrop-blur-xl rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl text-white">Feature Access Matrix</CardTitle>
            <CardDescription className="text-neutral-500">
              Comparative analysis of your current vs premium capabilities.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <div className="rounded-2xl border border-white/5 overflow-hidden">
              <div className="grid grid-cols-3 bg-white/5 px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                <div>Protocol Feature</div>
                <div className="text-center">Starter</div>
                <div className="text-center text-emerald-400 flex items-center justify-center gap-2">
                   Pro Tier
                </div>
              </div>

              {featureComparison.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-3 px-6 py-5 text-sm ${
                    i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                  } border-t border-white/5`}
                >
                  <div className="text-neutral-400 font-light">{row.feature}</div>
                  <div className="text-center">
                    {typeof row.free === "boolean" ? (
                      row.free ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" strokeWidth={3} />
                      ) : (
                        <X className="w-4 h-4 text-neutral-700 mx-auto" />
                      )
                    ) : (
                      <span className="text-neutral-500 font-mono text-xs">{row.free}</span>
                    )}
                  </div>
                  <div className="text-center">
                    {typeof row.pro === "boolean" ? (
                      row.pro ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" strokeWidth={3} />
                      ) : (
                        <X className="w-4 h-4 text-neutral-700 mx-auto" />
                      )
                    ) : (
                      <span className="text-white font-mono text-xs">{row.pro}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Clerk UserProfile */}
        <div className="rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-neutral-900/40 backdrop-blur-xl">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full shadow-none bg-transparent border-none p-8 md:p-12",
                navbar: "hidden",
                navbarMobileMenuButton: "hidden",
                headerTitle: "text-3xl text-white tracking-tighter mb-2",
                headerSubtitle: "text-neutral-400 font-light text-base",
                profileSectionTitleText: "text-neutral-500 uppercase tracking-widest font-mono text-[10px] border-b border-white/5 pb-4",
                userButtonTrigger: "hover:bg-white/5",
                userPreviewMainIdentifier: "text-white font-medium",
                userPreviewSecondaryIdentifier: "text-neutral-400",
                formButtonPrimary: "bg-white text-black hover:bg-neutral-200 border-none transition-all rounded-xl py-3 text-xs font-bold uppercase tracking-widest",
                formFieldInput: "bg-white/5 border-white/10 text-white rounded-xl focus:ring-purple-500/40",
                formFieldLabel: "text-neutral-400",
                activeDeviceIcon: "text-emerald-500",
                badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
              },
            }}
          />
        </div>
      </main>

      <Footer />
      
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}
