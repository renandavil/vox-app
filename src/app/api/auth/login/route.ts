
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateToken, setSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Faltam dados' }, { status: 400 });
        }

        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
        }

        const token = generateToken({ userId: user.id, email: user.email });
        await setSession(token);

        return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });

    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: 'Erro interno no login' }, { status: 500 });
    }
}
