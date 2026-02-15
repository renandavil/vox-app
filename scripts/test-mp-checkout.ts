
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Seu Token de TESTE
const accessToken = "TEST-5904595613054445-021319-e239bb34ac34d28fc515984bf27e4a23-2098126791";

const client = new MercadoPagoConfig({ accessToken: accessToken });

async function testCheckout() {
    console.log("🛠️ Iniciando Teste do Mercado Pago SDK (Modern)...");
    try {
        const preference = new Preference(client);

        const body = await preference.create({
            body: {
                items: [
                    {
                        id: 'premium_subscription',
                        title: 'VØX Premium (Teste)',
                        quantity: 1,
                        unit_price: 29.90,
                        currency_id: 'BRL',
                    }
                ],
                payer: {
                    email: "test_user_vox@test.com"
                },
                back_urls: {
                    success: "http://localhost:3000/success",
                    failure: "http://localhost:3000/failure",
                    pending: "http://localhost:3000/pending"
                },
                // auto_return: "approved"
            }
        });

        console.log("✅ CHECKOUT CRIADO COM SUCESSO!");
        console.log("URL:", body.init_point); // Se for V2, pode ser body.init_point ou body.body.init_point
        console.log("SANDBOX:", body.sandbox_init_point);

    } catch (error: any) {
        console.error("❌ ERRO NO MERCADO PAGO:", error);
        // Tente extrair a mensagem de erro da API
        if (error.response?.data) console.error("Detalhes:", JSON.stringify(error.response.data, null, 2));
    }
}

testCheckout();
