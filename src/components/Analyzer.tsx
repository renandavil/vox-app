"use client";
import { useState, useRef, useEffect } from 'react';
import { useSession } from "next-auth/react";

// --- Typewriter Component (Visual Effect) ---
const TypewriterText = ({ text, delay = 0, speed = 20 }: { text: string, delay?: number, speed?: number }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setStarted(true);
        }, delay);
        return () => clearTimeout(startTimeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;
        let i = 0;
        setDisplayedText(''); // Reset on text change if needed
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
            }
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed, started]);

    return (
        <span>
            {displayedText}
            {started && displayedText.length < text.length && (
                <span className="animate-pulse ml-1 text-emerald-400">|</span>
            )}
        </span>
    );
};

type AnalysisResult = {
    sentiment: string;
    timing_advice: string;
    suggestions: Array<{ type: string; text: string }>;
};

export default function Analyzer() {
    const { data: session, status: sessionStatus } = useSession();
    const [state, setState] = useState<'idle' | 'analyzing' | 'result' | 'error' | 'locked'>('idle');
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loadingStep, setLoadingStep] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [tool, setTool] = useState<'chat' | 'story'>('chat');

    // Effect to check blockage based on SESSION (Premium Priority)
    useEffect(() => {
        if (sessionStatus === 'loading') return;

        // @ts-ignore
        const isPremium = session?.user?.isPremium;

        if (isPremium) {
            // PREMIUM: Se já estiver bloqueado, desbloqueia. 
            // Se estiver 'result' ou 'analyzing', mantém.
            if (state === 'locked') {
                setState('idle');
            }
            return;
        }

        // FREE USER: Verifica limite no backend
        if (session?.user) {
            checkUsageLimit();
        } else {
            // VISITANTE: Verifica LocalStorage
            const used = localStorage.getItem('conversanatural_trial_v1');
            if (used && state !== 'result' && state !== 'analyzing') {
                setState('locked');
            }
        }

    }, [session, sessionStatus]); // Removido 'state' da dependência para evitar loop, mas cuidado com atualizações.

    const checkUsageLimit = async () => {
        try {
            const res = await fetch('/api/user/status');
            const data = await res.json();
            // Se não é premium E já usou o limite
            if (!data.isPremium && (data.usageCount || 0) >= 1) {
                // Só bloqueia se não estiver no meio de algo importante
                setState(prev => (prev === 'result' || prev === 'analyzing') ? prev : 'locked');
            }
        } catch (e) { console.error(e); }
    };

    const markAsUsed = () => {
        if (!session) {
            localStorage.setItem('conversanatural_trial_v1', 'true');
        }
        // Se logado, o backend já incrementa no POST.
    };

    // Loading Animation Loop
    const loadingTexts = [
        "Processando imagem...",
        "Detectando contexto...",
        "Analisando nuances...",
        "Formulando resposta natural...",
        "Finalizando..."
    ];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (state === 'analyzing') {
            setLoadingStep(0);
            let i = 0;
            interval = setInterval(() => {
                i++;
                if (i < loadingTexts.length) setLoadingStep(i);
            }, 800);
        }
        return () => clearInterval(interval);
    }, [state]);

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;
                    const MAX_DIMENSION = 800; // Resize to save tokens/bandwidth

                    if (width > height) {
                        if (width > MAX_DIMENSION) {
                            height = Math.round((height * MAX_DIMENSION) / width);
                            width = MAX_DIMENSION;
                        }
                    } else {
                        if (height > MAX_DIMENSION) {
                            width = Math.round((width * MAX_DIMENSION) / height);
                            height = MAX_DIMENSION;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        resolve(event.target?.result as string);
                        return;
                    }
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.6));
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setState('analyzing');

        try {
            const base64Image = await compressImage(file);
            const endpoint = tool === 'chat' ? '/api/analyze' : '/api/analyze-story';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Image }),
            });

            const textResponse = await response.text();
            let data;
            try {
                data = JSON.parse(textResponse);
            } catch (err) {
                console.error("JSON Error:", textResponse);
                throw new Error("Erro de resposta do servidor.");
            }

            if (!response.ok) {
                if (data.code === 'LIMIT_REACHED') {
                    setState('locked');
                    return; // Stop execution smoothly without throwing an error
                }
                throw new Error(data.details || data.error || 'Falha na análise');
            }

            setResult(data);
            markAsUsed();
            setState('result');

        } catch (error: any) {
            console.error('Error:', error);
            setErrorMsg(error.message || "Erro desconhecido");
            if (state !== 'locked') setState('error');
        }
    };

    const resetAnalysis = () => {
        setResult(null);
        setState('idle');
        // Re-check status if needed, but session effect handles it
    };

    const handleUnlock = async () => {
        if (!session) {
            window.location.href = '/login?next=checkout';
            return;
        }

        try {
            const res = await fetch('/api/checkout-mp', { method: 'POST' });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Erro ao iniciar pagamento.");
            }
        } catch (e) {
            console.error(e);
            alert("Erro de conexão.");
        }
    };

    return (
        <div style={{ width: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

            {/* LOCKED STATE (PREMIUM UPSIZE) */}
            {state === 'locked' && (
                <div className="fade-in" style={{ textAlign: 'center', padding: '1rem' }}>

                    <div className="glass p-8 border-emerald-500/30" style={{ maxWidth: '400px', margin: '0 auto', boxShadow: '0 0 40px rgba(16, 185, 129, 0.1)' }}>
                        <div className="text-4xl mb-4">👑</div>
                        <h3 className="text-2xl font-bold text-white mb-2">Desbloqueie o VØX GOD MODE</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Você atingiu o limite gratuito. Tenha acesso ilimitado e impressione em todas as conversas.
                        </p>

                        <ul className="text-left space-y-3 mb-8 text-sm text-gray-300">
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Análises Ilimitadas (Chat & Story)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Respostas Personalizadas (3 Tonz)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Acesso Vitalício (Sem mensalidade)
                            </li>
                        </ul>

                        <div className="mb-6">
                            <span className="text-3xl font-bold text-white">R$ 29,90</span>
                            <span className="text-xs text-gray-500 block uppercase tracking-widest">Pagamento Único</span>
                        </div>

                        <button
                            onClick={handleUnlock}
                            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 px-6 rounded-xl w-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                        >
                            {!session ? 'FAZER LOGIN E LIBERAR 🔓' : 'LIBERAR AGORA 🔓'}
                        </button>

                        {!session && (
                            <p onClick={() => window.location.href = '/login'} className="mt-6 text-xs text-gray-500 hover:text-white cursor-pointer transition-colors underline">
                                Já tem conta? Entrar
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* IDLE STATE */}
            {state === 'idle' && (
                <div className="fade-in">
                    <div className="glass" style={{ display: 'flex', padding: '0.4rem', borderRadius: '12px', marginBottom: '1.5rem', gap: '0.5rem' }}>
                        <button
                            onClick={() => setTool('chat')}
                            style={{
                                flex: 1, padding: '0.6rem', borderRadius: '8px',
                                background: tool === 'chat' ? 'var(--bg-elevated)' : 'transparent',
                                color: tool === 'chat' ? '#fff' : 'var(--text-muted)',
                                border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                            }}
                        >
                            💬 Chat
                        </button>
                        <button
                            onClick={() => setTool('story')}
                            style={{
                                flex: 1, padding: '0.6rem', borderRadius: '8px',
                                background: tool === 'story' ? 'var(--bg-elevated)' : 'transparent',
                                color: tool === 'story' ? '#fff' : 'var(--text-muted)',
                                border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                            }}
                        >
                            📸 Story
                        </button>
                    </div>

                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} />

                    <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.4))' }}>
                            {tool === 'chat' ? '📤' : '📲'}
                        </div>
                        <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>
                            {tool === 'chat' ? 'Enviar Print do Chat' : 'Enviar Print do Story'}
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            A IA vai ler o contexto e dizer <strong>exatamente</strong> o que responder.
                        </p>
                    </div>
                </div>
            )}

            {/* ANALYZING STATE */}
            {state === 'analyzing' && (
                <div style={{ padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div className="loader"></div>
                    <style jsx>{`
                        .loader {
                            width: 50px; height: 50px; position: relative;
                            background: conic-gradient(from 0deg, transparent 0%, var(--primary) 100%);
                            border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 2rem;
                        }
                        .loader::before { content: ''; position: absolute; inset: 4px; background: #000; border-radius: 50%; }
                        @keyframes spin { 100% { transform: rotate(360deg); } }
                    `}</style>
                    <h3 className="text-gradient" style={{ marginBottom: '0.5rem', height: '2rem' }}>
                        {loadingTexts[loadingStep] || "Processando..."}
                    </h3>
                </div>
            )}

            {/* ERROR STATE */}
            {state === 'error' && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                    <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Erro na Análise</h3>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>{errorMsg}</p>
                    <button onClick={resetAnalysis} className="btn btn-outline">Tentar Novamente</button>
                </div>
            )}

            {/* RESULT STATE with TYPEWRITER */}
            {state === 'result' && result && (
                <div className="fade-in">
                    <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <span style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--primary)' }}></span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Veredito IA</span>
                        </div>

                        <h3 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                            <TypewriterText text={result.sentiment} speed={30} />
                        </h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                            <TypewriterText text={result.timing_advice} delay={1000} speed={20} />
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Sugestões</h4>
                        <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-dim)' }}>Clique para copiar</span>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {result.suggestions.map((option, idx) => (
                            <div
                                key={idx}
                                className="suggestion-card"
                                onClick={() => {
                                    navigator.clipboard.writeText(option.text);
                                    alert("Copiado!");
                                }}
                            >
                                <div className="card-header">
                                    {/* Usa o 'type' que vem do JSON da IA, ou fallback */}
                                    <span className={`badge badge-${idx}`}>
                                        {option.type || (idx === 0 ? 'SEGURA' : idx === 1 ? 'NATURAL' : 'ENGAJADA')}
                                    </span>
                                    <span style={{ fontSize: '1.2rem', opacity: 0.5 }}>📋</span>
                                </div>
                                <p style={{ fontSize: '1.1rem', color: '#fff', lineHeight: 1.5 }}>
                                    {/* Efeito Cascata: Cada sugestão começa a digitar depois da anterior */}
                                    <TypewriterText text={`"${option.text}"`} delay={2000 + (idx * 1500)} speed={30} />
                                </p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={resetAnalysis}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '2.5rem', justifyContent: 'center' }}
                    >
                        Analisar Outra Mesma
                    </button>

                    <style jsx>{`
                        .suggestion-card {
                            padding: 1.5rem; background: rgba(255,255,255,0.02);
                            border-radius: 16px; border: 1px solid var(--border);
                            cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        }
                        .suggestion-card:hover {
                            background: rgba(255,255,255,0.05); border-color: var(--primary); transform: scale(1.01);
                        }
                        .badge {
                            font-size: 0.7rem; font-weight: 800; padding: 0.3rem 0.8rem; borderRadius: 99px;
                        }
                        .badge-0 { color: #fff; background: var(--secondary); }
                        .badge-1 { color: #000; background: var(--primary); }
                        .badge-2 { color: #fff; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); }
                        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                    `}</style>
                </div>
            )}
        </div>
    );
}
