export function AuraBackground() {
  return (
    <>
      {/* Base Layer: Dark Depth */}
      <div className="fixed inset-0 -z-30 bg-neutral-950"></div>

      {/* Hero Video/Pattern Layer */}
      <div className="fixed inset-0 -z-20 w-full h-full overflow-hidden pointer-events-none opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}
        ></div>
      </div>

      {/* Optimized CSS Aura Orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Main Violet Orb */}
        <div
          className="absolute w-[100vw] h-[100vh] rounded-full blur-[120px] opacity-[0.15] animate-pulse"
          style={{
            background: "radial-gradient(circle at center, rgba(139,92,246,0.4) 0%, transparent 70%)",
            top: "-20%",
            left: "-10%",
          }}
        ></div>

        {/* Deep Purple Accent */}
        <div
          className="absolute w-[80vw] h-[80vh] rounded-full blur-[100px] opacity-[0.1]"
          style={{
            background: "radial-gradient(circle at center, rgba(88,28,135,0.5) 0%, transparent 60%)",
            bottom: "0%",
            right: "-10%",
          }}
        ></div>

        {/* Subtle Blue Highlight */}
        <div
          className="absolute w-[60vw] h-[60vh] rounded-full blur-[150px] opacity-[0.08]"
          style={{
            background: "radial-gradient(circle at center, rgba(59,130,246,0.3) 0%, transparent 70%)",
            top: "20%",
            right: "10%",
          }}
        ></div>

        {/* Grain/Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
          }}
        ></div>
      </div>

      {/* Design Structure Lines */}
      <div className="fixed inset-0 -z-5 max-w-[1400px] mx-auto border-x border-white/[0.03] pointer-events-none">
        <div className="absolute left-1/3 h-full w-px bg-white/[0.02]"></div>
        <div className="absolute left-2/3 h-full w-px bg-white/[0.02]"></div>
      </div>
    </>
  );
}
