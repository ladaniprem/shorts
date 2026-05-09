'use server'

import Razorpay from 'razorpay'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function createRazorpayOrder(amount: number) {
  try {
    const session = await auth()
    const userId = session.userId
    if (!userId) throw new Error('Unauthorized')

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw new Error('Could not create order')
  }
}

export async function verifyRazorpayPayment(
  orderId: string,
  paymentId: string,
  signature: string,
  creditsToAdd: number
) {
  try {
    const session = await auth()
    const userId = session.userId
    if (!userId) throw new Error('Unauthorized')

    const text = `${orderId}|${paymentId}`
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex')

    if (generated_signature === signature) {
      // Payment is verified
      await prisma.user.update({
        where: { userId },
        data: {
          credits: {
            increment: creditsToAdd
          }
        }
      })
      return { success: true }
    } else {
      return { success: false, error: 'Invalid signature' }
    }
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error)
    return { success: false, error: 'Verification failed' }
  }
}
