import { NextResponse } from 'next/server';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { db } from '@/lib/db';

// Inicializa o Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const preference = new Preference(client);

        const body = await preference.create({
            body: {
                items: [
                    {
                        id: 'premium_subscription',
                        title: 'VØX Premium (Acesso Vitalício)',
                        quantity: 1,
                        unit_price: 29.90, // Preço Promocional
                        currency_id: 'BRL',
                    }
                ],
                payer: {
                    email: user.email,
                },
                back_urls: {
                    success: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
                    failure: `${process.env.NEXTAUTH_URL}/dashboard?failure=true`,
                    pending: `${process.env.NEXTAUTH_URL}/dashboard?pending=true`,
                },
                // auto_return: 'approved', // Causando erro na API v2 com back_urls
                notification_url: `${process.env.NEXTAUTH_URL}/api/webhook-mp`,
                metadata: {
                    userId: user.id,
                }
            }
        });

        return NextResponse.json({ url: body.init_point });

    } catch (error: any) {
        console.error('Erro MP:', error);
        return NextResponse.json({ error: 'Erro ao criar preferência' }, { status: 500 });
    }
}
