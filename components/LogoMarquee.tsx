"use client";

const platforms = [
  { name: "YouTube", icon: "simple-icons:youtube", color: "#FF0000" },
  { name: "TikTok", icon: "simple-icons:tiktok", color: "#ffffff" },
  { name: "Instagram", icon: "simple-icons:instagram", color: "#E1306C" },
  { name: "OpenAI", icon: "simple-icons:openai", color: "#ffffff" },
  { name: "Runway", icon: "simple-icons:runway", color: "#ffffff" },
  { name: "Claude", icon: "simple-icons:anthropic", color: "#ffffff" },
  { name: "Stripe", icon: "simple-icons:stripe", color: "#635BFF" },
  { name: "Vercel", icon: "simple-icons:vercel", color: "#ffffff" },
];

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "iconify-icon": any;
    }
  }
}

export function LogoMarquee() {

  const items = [...platforms, ...platforms, ...platforms];

  return (
    <div className="border-b border-white/5 bg-black py-8 overflow-hidden">
      <div className="flex items-center gap-0 marquee-wrapper">
        <div className="marquee-content flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-700">
          {items.map((platform, i) => (
            <div
              key={i}
              className="flex items-center gap-4 text-white hover:text-white transition-colors px-12 whitespace-nowrap group"
            >
              <iconify-icon 
                icon={platform.icon} 
                width="20" 
                style={{ color: platform.color }}
                className="opacity-50 group-hover:opacity-100 transition-opacity"
              ></iconify-icon>
              <span className="text-sm font-medium tracking-tight">
                {platform.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
