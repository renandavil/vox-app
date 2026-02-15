
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateToken, setSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Faltam dados' }, { status: 400 });
        }

        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        const token = generateToken({ userId: user.id, email: user.email });
        await setSession(token);

        return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });

    } catch (error: any) {
        console.error("Register Error:", error);
        return NextResponse.json({ error: 'Erro interno ao criar conta' }, { status: 500 });
    }
}
