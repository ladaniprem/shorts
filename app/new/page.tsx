import React from 'react'
import { checkUser } from '@/lib/checkUser';
import CreateProject from './CreateProject';
import { prisma } from '@/lib/prisma';

const Newpage = async () => {
    const userId = await checkUser();
    let credits = 0;

    if (userId) {
        const user = await prisma.user.findUnique({
            where: { userId },
            select: { credits: true }
        });
        credits = user?.credits ?? 0;
    }

    return <CreateProject user={userId ?? null} credits={credits} />
}

export default Newpage
