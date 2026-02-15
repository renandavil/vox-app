import { NextResponse } from 'next/server';
import MercadoPagoConfig, { Payment } from 'mercadopago';
import { db } from '@/lib/db';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(req: Request) {
    try {
        const urlObj = new URL(req.url);
        const topic = urlObj.searchParams.get('topic') || urlObj.searchParams.get('type');
        const id = urlObj.searchParams.get('id') || urlObj.searchParams.get('data.id');

        if (!id) {
            // As vezes o MP manda JSON no body
            const body = await req.json();
            if (body.type === 'payment') {
                await processPayment(body.data.id);
            }
            return NextResponse.json({ ok: true });
        }

        if (topic === 'payment') {
            await processPayment(id);
        }

        return NextResponse.json({ ok: true });

    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook Handler Failed' }, { status: 500 });
    }
}

async function processPayment(paymentId: string) {
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    if (paymentData.status === 'approved') {
        const userId = paymentData.metadata.user_id; // Metadata do MP vem snake_case

        if (userId) {
            console.log(`Liberando Premium para User: ${userId}`);
            await db.user.update({
                where: { id: userId },
                data: { isPremium: true }
            });
        }
    }
}
