'use client'
import { Button } from "@/components/ui/button"
import Script from "next/script"
import { createRazorpayOrder, verifyRazorpayPayment } from "@/app/actions/razorpay"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const PricingPage = () => {
    const router = useRouter()

    const handleRazorpayCheckout = async (amount: number, credits: number) => {
        try {
            const order = await createRazorpayOrder(amount)
            
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Shorts AI",
                description: `Purchase ${credits} credits`,
                order_id: order.id,
                handler: async function (response: any) {
                    const result = await verifyRazorpayPayment(
                        order.id,
                        response.razorpay_payment_id,
                        response.razorpay_signature,
                        credits
                    )
                    if (result.success) {
                        toast.success("Payment successful! Credits added.")
                        router.push("/dashboard")
                    } else {
                        toast.error("Payment verification failed.")
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
            }

            const rzp = new (window as any).Razorpay(options)
            rzp.open()
        } catch (error) {
            console.error("Payment error:", error)
            toast.error("Something went wrong with the payment.")
        }
    }

    const plans = [
        {
            name: "Starter",
            price: "₹100",
            amount: 100,
            credits: 1,
            features: ["1 Video"],
        },
        {
            name: "Pro",
            price: "₹1500",
            amount: 1500,
            credits: 25,
            features: ["25 videos"],
            popular: true,
        },
        {
            name: "Enterprise",
            price: "₹9900",
            amount: 9900,
            credits: 150,
            features: ["150 videos"],
        }

    ]
    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="min-h-screen py-12 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-gray-300 mb-4">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-xl text-gray-600 mb-12">
                        Choose the plan that&apos;s right for you
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div key={plan.name} className={`bg-white rounded-lg p-6 relative ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-br text-white from-[#8b5cf6] to-[#4c1d95] px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {plan.name}
                                </h3>

                                <div className="my-4">
                                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                    <span className="text-gray-500">/one-time</span>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center">
                                            <span className="text-purple-500 mr-3">
                                                ✔
                                            </span>
                                            <span className="text-gray-700">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    onClick={() => handleRazorpayCheckout(plan.amount, plan.credits)}
                                    className={`w-full ${plan.popular ? 'bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#8b5cf6] to-[#4c1d95] font-medium cursor-pointer' : 'bg-gray-800 hover:bg-gray-900 text-white cursor-pointer'}`}
                                >
                                    {plan.popular ? 'Sign up' : 'Get Started'}
                                </Button>

                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    )
}

export default PricingPage
