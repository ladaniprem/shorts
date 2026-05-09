import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Shorts — Create Viral Short Videos with AI",
  description: "Transform any idea into viral YouTube Shorts, TikToks, and Instagram Reels in seconds with AI.",
};

import { ThemeProvider } from "@/components/theme-provider";

import Script from "next/script";

import { ui } from "@clerk/ui";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased min-h-full flex flex-col transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
          ui={ui}
          appearance={{
            baseTheme: dark,
            layout: {
              logoImageUrl: "/ai-shorts-logo.png",
              socialButtonsPlacement: "top",
              showOptionalFields: false,
            },
            variables: {
              colorPrimary: "#ffffff",
              colorBackground: "#050505",
              colorInputBackground: "transparent",
              colorInputText: "#ffffff",
              colorText: "#ffffff",
              colorTextSecondary: "#a1a1aa",
              borderRadius: "1.25rem",
              fontFamily: "var(--font-inter)",
            },
            elements: {
              card: "bg-black/40 border border-white/20 shadow-[0_0_50px_-12px_rgba(255,255,255,0.15)] backdrop-blur-3xl p-8 rounded-[32px] overflow-hidden relative",
              navbar: "bg-transparent",
              headerTitle: "!text-white text-[28px] font-bold tracking-tight text-center",
              headerSubtitle: "!text-neutral-400 text-[15px] text-center mt-2",
              logoBox: "mx-auto mb-6 w-16 h-16 flex items-center justify-center",
              logoImage: "w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]",
              formButtonPrimary: "bg-white !text-black hover:bg-neutral-200 transition-all font-bold h-12 rounded-xl text-sm shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]",
              socialButtonsBlockButton: "bg-black/50 border border-white/10 hover:bg-white/[0.03] hover:border-white/20 transition-all h-12 rounded-xl !text-white",
              socialButtonsBlockButtonText: "!text-white font-semibold text-[14px]",
              socialButtonsBlockButtonArrow: "hidden",
              dividerLine: "!bg-white/15",
              dividerText: "!text-[11px] font-bold !text-neutral-600 uppercase tracking-widest px-4",
              formFieldLabel: "!text-[13px] font-medium !text-neutral-400 ml-1 mb-1.5",
              formFieldInput: "!bg-white/5 !border-white/10 focus:!border-white/40 h-12 px-4 rounded-xl transition-all !text-white hover:!border-white/20",
              footerActionLink: "!text-white hover:!text-neutral-300 font-semibold",
              footerActionText: "!text-neutral-500",
              identityPreviewText: "!text-white font-medium",
              identityPreviewEditButtonIcon: "!text-white",
              userButtonPopoverCard: "bg-[#0a0a0a] border border-white/10 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl",
              userButtonPopoverActionButton: "hover:bg-white/[0.03] transition-colors py-3 border-b border-white/5",
              userButtonPopoverActionButtonText: "!text-white font-medium",
              userButtonPopoverActionButtonIcon: "!text-purple-400",
              userButtonPopoverHeader: "border-b border-white/5 bg-white/[0.02]",
              userButtonPopoverFooter: "bg-white/[0.02] border-t border-white/5",
              userButtonMain: "!text-white",
              userButtonPopoverCustomItemButton: "hover:bg-white/5 transition-all",
              
              // User Profile (Account Settings) UI Fixes
              userProfilePageBox: "bg-[#050505] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl",
              userProfileHeaderTitle: "!text-white text-2xl font-bold tracking-tight",
              userProfileHeaderSubtitle: "!text-neutral-400 text-sm mb-4",
              userProfileNavbar: "bg-white/[0.02] border-r border-white/5 gap-2 p-6 h-full",
              userProfileNavbarButton: "rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-all mb-1 flex items-center gap-3 px-4 py-2",
              userProfileNavbarButtonText: "!text-inherit font-medium text-sm",
              userProfileNavbarButton__active: "bg-white/10 !text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]",
              userProfileSection: "border-b border-white/5 py-8 first:pt-0 last:border-0",
              userProfileSectionTitleText: "!text-white font-bold text-xl mb-2",
              userProfileSectionSubtitleText: "!text-neutral-400 text-sm",
              userProfileSectionPrimaryButton: "bg-white !text-black hover:bg-neutral-200 transition-all font-bold px-6 py-2.5 rounded-xl text-xs",
              userProfileSectionDeleteButton: "bg-red-500/10 !text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all font-bold px-6 py-2.5 rounded-xl text-xs",
              userProfileAccordionTitleText: "!text-white font-semibold",
              userProfileAccordionContent: "bg-white/[0.01] rounded-2xl p-6 border border-white/5 mt-4",
              userProfileBlockButton: "bg-white/[0.02] border border-white/10 hover:bg-white/5 transition-all rounded-xl",
              userProfileBlockButtonText: "!text-white font-medium",
              userProfileBlockButtonArrow: "!text-neutral-500",
              userProfilePageScrollBox: "bg-[#050505]",
              profilePage: "bg-[#050505] text-white",
              profileSectionTitleText: "!text-white font-bold",
              profileSectionContentText: "!text-neutral-300",
              profileSectionPrimaryButtonText: "!text-black",
              profileSectionHeaderTitleText: "!text-white font-bold text-lg",
              profileSectionHeaderSubtitleText: "!text-neutral-400 text-sm",
              accordionTrigger: "!text-white",
              accordionContent: "!text-neutral-300",
              formFieldSuccessText: "!text-green-400",
              formFieldErrorText: "!text-red-400",
              formFieldHintText: "!text-neutral-500",
              formFieldLabel: "!text-neutral-400 font-medium mb-1",
              formFieldInput: "!bg-white/5 !border-white/10 !text-white",
              breadcrumbsItem: "!text-neutral-400",
              breadcrumbsItem__active: "!text-white font-bold",
              breadcrumbsSeparator: "!text-neutral-600",
              
              organizationSwitcherTrigger: "hover:bg-white/5",
              formFieldInputShowPasswordButton: "!text-neutral-500",
              footer: "hidden", 
              rootBox: "text-white",
              form: "text-white",
              main: "text-white",
            },
          }}
        >
          {children}
        </ClerkProvider>
        </ThemeProvider>
        <Script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
