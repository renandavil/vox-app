
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

const ADMIN_EMAIL = 'renandavilamoreira11@gmail.com';

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session || session.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        const body = await req.json();
        const { userId, action } = body;

        if (!userId || !action) {
            return NextResponse.json({ error: 'Faltam dados' }, { status: 400 });
        }

        if (action === 'toggle_premium') {
            const user = await db.user.findUnique({ where: { id: userId } });
            if (user) {
                await db.user.update({
                    where: { id: userId },
                    data: { isPremium: !user.isPremium }
                });
            }
        }
        else if (action === 'reset_usage') {
            await db.user.update({
                where: { id: userId },
                data: { usageCount: 0 }
            });
        }
        else if (action === 'delete_user') {
            await db.user.delete({ where: { id: userId } });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ error: 'Erro na operação' }, { status: 500 });
    }
}
