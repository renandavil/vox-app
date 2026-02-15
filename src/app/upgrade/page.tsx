"use client";
import React, { useState } from 'react';

export default function UpgradePage() {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url; // Redireciona para o Mercado Pago
            } else {
                alert('Erro ao criar pagamento: ' + (data.error || 'Erro desconhecido'));
            }
        } catch (error) {
            alert('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Torne-se um Mestre da Sedução</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Desbloqueie todo o poder da IA e nunca mais fique no vácuo.</p>
            </div>

            <div className="card glass" style={{ maxWidth: '400px', width: '100%', padding: '3rem', borderRadius: '2rem', border: '1px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>

                <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: '#000', padding: '0.5rem 1.5rem', fontWeight: 800, borderBottomLeftRadius: '1rem' }}>
                    POPULAR
                </div>

                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Premium</h2>
                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '3rem', fontWeight: 800 }}>R$ 29,90</span>
                    <span style={{ color: '#666', marginLeft: '0.5rem' }}>/mês</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <li style={{ display: 'flex', gap: '1rem' }}>✅ <span>Análises <strong>Ilimitadas</strong></span></li>
                    <li style={{ display: 'flex', gap: '1rem' }}>✅ <span>Respostas Personalizadas</span></li>
                    <li style={{ display: 'flex', gap: '1rem' }}>✅ <span>Estilos de Flerye Avançados</span></li>
                    <li style={{ display: 'flex', gap: '1rem' }}>✅ <span>Suporte Prioritário</span></li>
                </ul>

                <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem', cursor: loading ? 'wait' : 'pointer' }}
                >
                    {loading ? 'Carregando...' : 'ASSINAR AGORA'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
                    Pagamento seguro via Mercado Pago
                </p>
            </div>

        </main>
    );
}
