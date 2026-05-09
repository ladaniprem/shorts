import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const checkUser = async () => {
    const user = await currentUser();

    if (user) {
        const userId = user.id;
        const email = user.primaryEmailAddress?.emailAddress;
        const existingUser = await prisma.user.findUnique({
            where: {
                 userId
            }
        });
        if (!existingUser && email) {
            await prisma.user.create({
                data: {
                    userId,
                    email: email ?? ''
                }
            });
        }
        return user?.id || null;
    }

    else if (!user)
        return null;
}
export default checkUser;



