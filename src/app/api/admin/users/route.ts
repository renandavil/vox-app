import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const ADMIN_EMAIL = 'renandavilamoreira11@gmail.com';

export async function GET() {
    try {
        let userEmail: string | null = null;

        // 1. Tenta sessão manual
        const manualSession: any = await getSession();
        if (manualSession) {
            userEmail = manualSession.email;
        }

        // 2. Se não achou, tenta sessão NextAuth
        if (!userEmail) {
            const nextSession = await getServerSession(authOptions);
            if (nextSession?.user?.email) {
                userEmail = nextSession.user.email;
            }
        }

        if (!userEmail || userEmail !== ADMIN_EMAIL) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        // Fetch all users, excluding passwords for safety
        const users = await db.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                isPremium: true,
                usageCount: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
    }
}
