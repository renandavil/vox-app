import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// OpenAI client initialized inside handler to avoid build errors
const rateLimit = new Map<string, number>();

export async function POST(request: Request) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        console.log("--- START REQUEST: /api/analyze (CHAT) ---");

        // --- 1. IP & IDENTITY ---
        const forwardedFor = request.headers.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';

        const crypto = require('crypto');
        const ipHash = crypto.createHash('md5').update(ip).digest('hex');

        console.log(`[DEBUG] IP: ${ip} | Hash: ${ipHash}`);

        // Rate Limit (Memory)
        const now = Date.now();
        const lastRequest = rateLimit.get(ipHash);
        if (lastRequest && (now - lastRequest) < 2000) {
            return NextResponse.json({ error: 'Calma.', details: 'Espere um pouco.' }, { status: 429 });
        }
        rateLimit.set(ipHash, now);

        // Get User Session
        let session: any = await getSession();
        let userId = session?.userId;
        if (!userId) {
            const nextSession = await getServerSession(authOptions);
            if (nextSession?.user) {
                // @ts-ignore
                userId = nextSession.user.id;
            }
        }

        let user = null;
        if (userId) {
            // FORCE FETCH
            user = await db.user.findUnique({ where: { id: userId } });
            console.log(`[DEBUG] User Authenticated: ${user?.email} (Premium: ${user?.isPremium})`);
        } else {
            console.log(`[DEBUG] Guest User (No Session)`);
        }

        // --- 2. ANTI-ABUSE (BLOCKING LOGIC & CONSUMPTION) ---

        // A) BLOQUEIO: Se for Free e já usou -> BLOQUEIA
        // @ts-ignore
        const deviceData = await db.deviceUsage.findUnique({
            where: { ipHash: ipHash }
        });

        console.log(`[DEBUG] Device (IP) Usage: ${deviceData?.usageCount || 0}`);

        if (deviceData && deviceData.usageCount >= 1) {
            const isPremium = user && user.isPremium;
            if (!isPremium) {
                console.log(`[BLOCK] User ${userId || 'Guest'} blocked by Device Limit.`);
                return NextResponse.json({
                    error: 'Limite por Dispositivo Atingido',
                    details: 'Seu dispositivo já usou o teste grátis. Assine para continuar.',
                    code: 'LIMIT_REACHED'
                }, { status: 403 });
            }
        }

        if (user && !user.isPremium && user.usageCount >= 1) {
            console.log(`[BLOCK] User ${user.email} blocked by Account Limit.`);
            return NextResponse.json({
                error: 'Limite da Conta Atingido',
                details: 'Você já usou seu teste grátis. Assine o Premium para continuar.',
                code: 'LIMIT_REACHED'
            }, { status: 403 });
        }

        // B) CONSUMO ANTECIPADO (Optimistic Consumption)
        // Incrementa o uso *antes* de gerar a IA.
        // Isso garante que se houver falha na IA, o crédito já foi "gasto" (evita bypass por erro).

        console.log(`[CONSUME] Incrementing Usage (Account & Device)...`);

        if (user) {
            await db.user.update({
                where: { id: user.id },
                data: { usageCount: { increment: 1 } }
            });
        }

        // Sempre incrementa IP, independente de usuário premium, para fins de tracking.
        // Se for premium, ele ignora o bloqueio no inicio, mas conta aqui.
        await db.deviceUsage.upsert({
            where: { ipHash: ipHash },
            update: { usageCount: { increment: 1 }, lastUsedAt: new Date() },
            create: { ipHash: ipHash, usageCount: 1 }
        });


        // --- 3. AI GENERATION ---
        const body = await request.json();
        const { image } = body;

        if (!image) return NextResponse.json({ error: 'Sem imagem.' }, { status: 400 });

        const MIMICRY_INSTRUCTION = `
        INSTRUÇÃO DE ESTILO:
        - Tente identificar o tom do usuário no print.
        - Se ele é formal, seja formal. Se ele usa gírias, use gírias leves.
        - O objetivo é parecer que FOI ELE quem escreveu.
        `;

        const analysisPrompt = `
      Você é um assistente de comunicação treinado para conversas REAIS e MADURAS.
      O objetivo não é "seduzir com truques", mas sim CONSTRUIR CONEXÃO.

      ---
      FILOSOFIA "NATURAL GENIUS":
      1. Seja autêntico. Nada de frases de "efeito" que parecem robô.
      2. Se ela fez uma pergunta, responda a pergunta! Não esquive.
      3. Se a conversa está chata, sugira algo interessante mas LEVE (sem perguntas profundas do nada).
      4. Humor é bom, mas sem parecer palhaço. Use ironia fina.

      ---
      ${MIMICRY_INSTRUCTION}

      ---
      GERE 3 SUGESTÕES DE RESPOSTA (JSON):

      OPÇÃO 1: "SEGURA / EDUCADA"
      - A resposta educada e correta. Funciona para manter a conversa fluindo sem riscos.
      
      OPÇÃO 2: "RÁPIDA / ESPONTÂNEA"
      - Uma resposta curta, como se você estivesse digitando no elevador.
      - Passa a vibe de "não estou pensando muito nisso".

      OPÇÃO 3: "ENGAJADA / PERGUNTA"
      - Demonstra interesse real no assunto. Faz a conversa evoluir.

      ---
      Retorne APENAS um JSON:
      {
        "sentiment": "O clima da conversa (Ex: Fluindo bem / Travada / Ela tá interessada)",
        "timing_advice": "Conselho simples (Ex: Pode responder agora / Espere uns 10 min)",
        "suggestions": [
          { "type": "Segura (Padrão)", "text": "..." },
          { "type": "Espontânea (Curta)", "text": "..." },
          { "type": "Engajada (Assunto)", "text": "..." }
        ]
      }
    `;

        const modelsToTry = ["gpt-4o", "gpt-4o-mini"];
        let jsonResult = null;
        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                // console.log(`Tentando modelo: ${modelName}...`);
                const response = await openai.chat.completions.create({
                    model: modelName,
                    messages: [
                        { role: "system", content: analysisPrompt },
                        {
                            role: "user",
                            content: [
                                { type: "text", text: "Me ajude a responder isso de forma natural:" },
                                { type: "image_url", image_url: { "url": image, "detail": "high" } },
                            ],
                        },
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.7,
                    max_tokens: 1000,
                });

                const content = response.choices[0].message.content;
                if (!content) throw new Error("Vazio");
                jsonResult = JSON.parse(content);
                break;
            } catch (err: any) {
                console.error(`Erro ${modelName}:`, err);
                lastError = err;
            }
        }

        if (!jsonResult) throw lastError;

        // --- 4. LOGGING (CONTENT) ---
        // Usage already handled. Log content here.
        await db.analysisLog.create({
            data: {
                userId: user?.id,
                type: 'CHAT',
                sentiment: jsonResult.sentiment || 'Sem dados',
                advice: jsonResult.timing_advice || 'Sem dados'
            }
        });

        console.log("--- REQUEST SUCCESS (Credit Consumed) ---");
        return NextResponse.json(jsonResult);

    } catch (error: any) {
        console.error('SERVER ERROR:', error);
        return NextResponse.json({ error: 'Erro no servidor.', details: error.message }, { status: 500 });
    }
}
