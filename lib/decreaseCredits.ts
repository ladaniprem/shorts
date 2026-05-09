import { prisma } from "./prisma"

export const decreaseCredits = async (userId: string) => {
   await prisma.user.update({
      where: {
         userId
      },
      data: {
         credits: {
            decrement: 1
         }
      }
   })
}