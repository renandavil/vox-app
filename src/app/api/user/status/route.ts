import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
    try {
        let userId: string | null = null;

        // 1. Tenta sessão manual
        const manualSession: any = await getSession();
        if (manualSession) {
            userId = manualSession.userId;
        }

        // 2. Se não achou, tenta sessão NextAuth
        if (!userId) {
            const nextSession = await getServerSession(authOptions);
            if (nextSession?.user) {
                // @ts-ignore
                userId = nextSession.user.id;
            }
        }

        if (!userId) {
            return NextResponse.json({ isLoggedIn: false });
        }

        const user = await db.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ isLoggedIn: false });
        }

        return NextResponse.json({
            isLoggedIn: true,
            isPremium: user.isPremium,
            usageCount: user.usageCount,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao obter status' }, { status: 500 });
    }
}
