"use client";

import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { ContactModal } from "@/components/ContactModal";
import Script from "next/script";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/app/actions/razorpay";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  FREE_PLAN,
  PRO_PLAN,
} from "@/lib/plan-config";

const basePlans = [
  {
    name: "Starter",
    price: "₹100",
    amount: 100,
    credits: 1,
    description: "Perfect for a single viral short.",
    features: ["1 High-Fidelity Video", "Standard Support"],
    cta: "Get Started",
    popular: false,
    color: "purple",
  },
  {
    name: "Pro",
    price: "₹1500",
    amount: 1500,
    credits: 25,
    description: "For creators who publish daily.",
    features: ["25 High-Fidelity Videos", "Priority Support", "Custom Voices"],
    cta: "Go Pro",
    popular: true,
    color: "purple",
  },
  {
    name: "Enterprise",
    price: "₹9900",
    amount: 9900,
    credits: 150,
    description: "For agencies and power creators.",
    features: ["150 High-Fidelity Videos", "24/7 Support", "API Access"],
    cta: "Contact Sales",
    popular: false,
    color: "neutral",
  },
];

export function PricingSection() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRazorpayCheckout = async (amount: number, credits: number) => {
    try {
      const order = await createRazorpayOrder(amount);
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Shorts AI",
        description: `Purchase ${credits} credits`,
        order_id: order.id,
        handler: async function (response: unknown) {
          const result = await verifyRazorpayPayment(
            order.id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            credits
          );
          if (result.success) {
            toast.success("Payment successful! Credits added.");
            router.push("/dashboard");
          } else {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#8b5cf6",
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI / GPay",
                instruments: [
                  {
                    method: "upi",
                  },
                ],
              },
            },
            sequence: ["block.upi"],
          },
        },
      };

      const rzp = new (window as unknown).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong with the payment.");
    }
  };

  return (
    <section
      id="pricing"
      className="py-32 bg-black border-b border-white/5 relative"
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-20">
          <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-6">
            03 — Investment
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white leading-none">
            Simple Pricing
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {basePlans.map((plan) => {
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col p-8 rounded-[32px] border transition-all duration-500 group backdrop-blur-2xl ${
                  plan.popular
                    ? "border-purple-500/50 bg-purple-950/5 shadow-[0_0_40px_-10px_rgba(139,92,246,0.2)]"
                    : "border-white/15 bg-white/[0.02] hover:border-white/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-500 border border-purple-400 rounded-full text-[10px] font-bold text-black uppercase tracking-widest shadow-[0_0_20px_rgba(139,92,246,0.5)] z-20">
                    Recommended
                  </div>
                )}

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">
                      {plan.name}
                    </h3>
                    {plan.popular && (
                      <Sparkles className="w-5 h-5 text-purple-500" />
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-5xl font-light tracking-tight text-white">
                      {plan.price}
                    </span>
                    <span className="text-sm text-neutral-500 font-mono">
                      /one-time
                    </span>
                  </div>

                  <p className="text-neutral-400 text-sm leading-relaxed border-b border-white/5 pb-8 mb-8 min-h-[80px]">
                    {plan.description}
                  </p>

                  <ul className="space-y-4 mb-8 grow">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-neutral-300"
                      >
                        <Check
                          className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? "text-purple-500" : "text-neutral-500"}`}
                        />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  {!isMounted ? (
                    <button
                      className="flex items-center justify-center w-full py-4 text-xs font-mono uppercase tracking-widest border border-white/10 text-white opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Loading...
                    </button>
                  ) : !isSignedIn ? (
                    <SignInButton forceRedirectUrl="/">
                      <button className="flex items-center justify-center w-full py-4 text-xs font-mono uppercase tracking-widest transition-all duration-300 border bg-white text-black border-white hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        {plan.cta}
                      </button>
                    </SignInButton>
                  ) : (
                    <button
                      onClick={() => handleRazorpayCheckout(plan.amount, plan.credits)}
                      className={`flex items-center justify-center w-full py-4 text-xs font-mono uppercase tracking-widest transition-all duration-300 border hover:scale-[1.02] active:scale-[0.98] ${
                        plan.popular
                          ? "bg-white text-black border-white hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                          : "bg-transparent text-white border-white/10 hover:border-white/30 hover:bg-white/5"
                      } cursor-pointer`}
                    >
                      {plan.cta}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
