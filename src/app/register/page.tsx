"use client";
import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                console.error("Non-JSON response:", text);
                throw new Error("Erro de servidor. Tente novamente mais tarde.");
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao criar conta');
            }

            // Sucesso
            window.location.href = '/tool';
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: '/tool' });
    };

    const handleFacebookLogin = () => {
        signIn('facebook', { callbackUrl: '/tool' });
    };

    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>

            {/* Background Effects */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
            <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)', filter: 'blur(80px)' }}></div>

            <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '3rem', borderRadius: '1.5rem', position: 'relative', zIndex: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(20, 20, 20, 0.6)', backdropFilter: 'blur(12px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>

                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>Criar Conta</h1>
                    <p style={{ color: '#94a3b8' }}>Junte-se ao clube e domine o jogo.</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div className="input-group">
                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Nome Completo</label>
                        <input name="name" type="text" placeholder="Seu nome" required style={inputStyle} />
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Email</label>
                        <input name="email" type="email" placeholder="seu@email.com" required style={inputStyle} />
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Senha</label>
                        <input name="password" type="password" placeholder="••••••••" required style={inputStyle} />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary"
                        style={{
                            marginTop: '0.5rem',
                            padding: '1rem',
                            fontSize: '1rem',
                            justifyContent: 'center',
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'wait' : 'pointer'
                        }}
                    >
                        {isLoading ? 'Criando conta...' : 'Começar Agora ->'}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>OU</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                    </div>

                    <button type="button" onClick={handleGoogleLogin} style={socialBtnStyle}>
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
                        <span>Entrar com Google</span>
                    </button>



                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                    Já tem uma conta? <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Fazer Login</Link>
                </div>
            </div>

        </main>
    );
}

const inputStyle = {
    width: '100%',
    padding: '0.9rem 1rem',
    borderRadius: '0.75rem',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s'
};

const socialBtnStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '0.75rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
};
