"use client";
import Analyzer from "@/components/Analyzer";
import UserDashboard from "@/components/UserDashboard"; // Importar dashboard
import { useSession } from "next-auth/react";

export default function ToolPage() {
    const { data: session } = useSession();

    return (
        // @ts-ignore
        <UserDashboard userEmail={session?.user?.email || "Convidado"} isPremium={session?.user?.isPremium}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* HEADER DA PÁGINA */}
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>
                        Laboratório VØX
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Carregue um print ou story e deixe a IA fazer a mágica.
                    </p>
                </div>

                {/* FERRAMENTA PRINCIPAL */}
                <div className="glass" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                    <Analyzer />
                </div>

                {/* DICAS RÁPIDAS (FOOTER) */}
                <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <TipCard icon="💡" title="Prints Longos" text="Se a conversa for longa, use o modo 'Scrolling Screenshot' do seu celular." />
                    <TipCard icon="🔒" title="100% Privado" text="Seus prints são processados e descartados. Ninguém lê suas mensagens." />

                </div>

            </div>
        </UserDashboard> // Fechando o wrapper
    );
}

function TipCard({ icon, title, text }: any) {
    return (
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>{icon}</div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '0.4rem' }}>{title}</h3>
            <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.5 }}>{text}</p>
        </div>
    )
}
