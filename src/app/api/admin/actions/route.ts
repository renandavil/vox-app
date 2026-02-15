import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const adminEmails = ['admin@vox.com', session?.user?.email];

    // Simples check de sessão
    if (!session || !adminEmails.includes(session.user?.email)) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    try {
        const { action, userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (action === 'toggle_premium') {
            await db.user.update({
                where: { id: userId },
                data: { isPremium: !user.isPremium }
            });
            return NextResponse.json({ ok: true, message: `Premium: ${!user.isPremium}` });
        }

        if (action === 'reset_usage') {
            await db.user.update({
                where: { id: userId },
                data: { usageCount: 0 }
            });
            return NextResponse.json({ ok: true, message: "Uso resetado." });
        }

        if (action === 'delete_user') {
            await db.user.delete({ where: { id: userId } });
            return NextResponse.json({ ok: true, message: "Usuário deletado." });
        }

        return NextResponse.json({ error: "Ação inválida" }, { status: 400 });

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
