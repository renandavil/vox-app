"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  return (
    <main>

      {/* =========================================
          SECTION 1: HERO (THE HOOK) - DARK 
          ========================================= */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
        zIndex: 20
      }}>
        {/* Header Glass */}
        <header className="glass" style={{
          width: 'calc(100% - 4rem)', margin: '2rem auto',
          padding: '1rem 2rem', borderRadius: '20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100
        }}>
          <div style={{ fontWeight: 800, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', letterSpacing: '-0.02em', color: '#fff' }}>
            <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 15px var(--primary)' }}></div>
            VØX
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s' }}>
              Entrar
            </Link>
            <Link href="/register" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1.5rem' }}>
              Começar Agora
            </Link>
          </div>
        </header>

        {/* BACKGROUND LAYERS */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {/* Grid Sutil */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)'
          }}></div>
        </div>

        {/* FLOATING ELEMENTS */}
        <FloatingBadge top="25%" left="10%" rotate="-6deg" delay="0s" text="Hahaha duvido... 🤣" sub="Ela • 20:42" />
        <FloatingBadge top="30%" right="12%" rotate="5deg" delay="1s" text="INTERESSE: 85%" isTech />

        <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 2, paddingBottom: '4rem', paddingTop: '8rem' }}>

          <div className="fade-in" style={{ padding: '0.5rem 1.2rem', borderRadius: '99px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', marginBottom: '2rem', backdropFilter: 'blur(10px)', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="dot-pulse"></span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Sistema de Sedução v2.0</span>
          </div>

          <h1 className="fade-in fade-in-delay-1" style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', lineHeight: 1.1, marginBottom: '2rem', fontWeight: 800 }}>
            NÃO DEIXE O <br />
            ASSUNTO <span className="text-gradient-primary">MORRER.</span>
          </h1>

          <p className="fade-in fade-in-delay-2" style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '580px', marginBottom: '3rem' }}>
            A única IA alimentada por psicologia comportamental. <br />
            Envie prints. Receba respostas. <strong>Marque o encontro.</strong>
          </p>


        </div>
      </section>


      {/* =========================================
          SECTION 2: THE CEMETERY (PROBLEM)
          ========================================= */}
      <section className="section" style={{ background: '#080808', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="fade-in" style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>O "Cemitério" de Conversas.</h2>
            <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', color: 'var(--text-muted)' }}>
              A maioria dos matches morre não por falta de química, mas por <strong style={{ color: '#fff' }}>falta de timing</strong>. Um erro e você vira "apenas mais um".
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5rem' }}>
            <InteractivePhone type="insta" />
            <InteractivePhone type="whats" />
          </div>
        </div>
      </section>


      {/* =========================================
          SECTION 3: FEATURES (GLASS CARDS)
          ========================================= */}
      <section className="section" style={{ position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span className="badge-premium" style={{ marginBottom: '1rem' }}><div className="badge-premium-content">TECNOLOGIA</div></span>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Por que funciona sempre?</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <TechCard
              icon="🧠"
              title="Q.I. Social 2.0"
              text="O modelo não lê apenas palavras. Ele lê subtexto, intenção e níveis de interesse ocultos."
            />
            <TechCard
              icon="⚡"
              title="Calibragem Push-Pull"
              text="A técnica clássica de 'morde e assopra' aplicada perfeitamente para criar tensão sexual."
            />
            <TechCard
              icon="🎯"
              title="Foco em Fechamento"
              text="Chega de papo furado. Cada sugestão é desenhada para avançar em direção ao encontro."
            />
          </div>
        </div>
      </section>


      {/* =========================================
          SECTION 4: PRODUCT DEMO (X-RAY)
          ========================================= */}
      <section id="demo" className="section" style={{ background: 'linear-gradient(to bottom, transparent, rgba(16, 185, 129, 0.05))', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Não é mágica. <span className="text-gradient-primary">É Ciência.</span></h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Veja como o VØX dissecaria a última mensagem que ela te mandou.</p>
          </div>

          {/* DEMO UI WRAPPER */}
          <div className="glass" style={{ maxWidth: '1000px', margin: '0 auto', overflow: 'hidden', padding: 0 }}>
            {/* Window Header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.8rem', background: 'rgba(0,0,0,0.3)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }}></div>
              <div style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px' }}>VØX ENGINE v2.4</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {/* Left: Input */}
              <div style={{ padding: '3rem', borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1rem', letterSpacing: '2px', fontWeight: 700 }}>MENSAGEM RECEBIDA</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 500, color: '#fff', marginBottom: '2rem', lineHeight: 1.4 }}>"Não sei se é uma boa ideia a gente se ver hoje..."</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ padding: '0.3rem 0.8rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.7rem', fontWeight: 700 }}>OBJEÇÃO</span>
                  <span style={{ padding: '0.3rem 0.8rem', borderRadius: '6px', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)', color: '#eab308', fontSize: '0.7rem', fontWeight: 700 }}>INCERTEZA</span>
                </div>
              </div>

              {/* Right: Output */}
              <div style={{ padding: '3rem', background: 'rgba(16, 185, 129, 0.02)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '1rem', letterSpacing: '2px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="dot-pulse"></span> ANÁLISE VØX
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>Ela não disse "não". Ela disse "não sei". Isso é um teste de confiança. Se você insistir, parece desesperado. Se concordar, parece fraco.</p>

                <div style={{ background: '#09090b', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--primary-dim)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.8rem', fontWeight: 700 }}>RESPOSTA SUGERIDA (MODE: OUSADO)</div>
                  <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 500 }}>"Tranquilo. Eu ia te levar no melhor sushi da cidade, mas agora vou ter que comer por dois. 🍣"</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================
          SECTION 5: FOOTER / CTA
          ========================================= */}
      <section className="section" style={{ paddingBottom: '4rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Pronto para assumir o controle?</h2>
          <Link href="/register" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}>
            Acessar VØX Agora
          </Link>
          <p style={{ marginTop: '2rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>© 2026 VØX Inteligência Social. Todos os direitos reservados.</p>
        </div>
      </section>


      <style jsx global>{`
        .dot-pulse { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 0 0 var(--primary-glow); animation: pulse-green 2s infinite; }
        @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 var(--primary-glow); } 70% { box-shadow: 0 0 0 6px rgba(0,0,0,0); } 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); } }
      `}</style>
    </main>
  );
}

// --- SUB-COMPONENTS (Keep styling consistent) ---

function FloatingBadge({ top, left, right, bottom, rotate, delay, text, sub, isTech }: any) {
  return (
    <div className="glass" style={{
      position: 'absolute', top, left, right, bottom,
      transform: `rotate(${rotate})`,
      padding: '1rem 1.5rem',
      animation: `float-card 6s ease-in-out infinite`,
      animationDelay: delay,
      zIndex: 5,
      border: isTech ? '1px solid var(--primary)' : '1px solid var(--border)',
      boxShadow: isTech ? '0 0 20px rgba(16, 185, 129, 0.1)' : '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      {sub && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{sub}</div>}
      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: isTech ? 'var(--primary)' : '#fff' }}>{text}</div>
      <style jsx>{`
                @keyframes float-card {
                    0%, 100% { transform: translateY(0) rotate(${rotate}); }
                    50% { transform: translateY(-15px) rotate(${rotate}); }
                }
            `}</style>
    </div>
  )
}

function TechCard({ icon, title, text }: any) {
  return (
    <div className="card glass" style={{ textAlign: 'left', transition: 'all 0.3s ease' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', width: 'fit-content', padding: '0.8rem', borderRadius: '12px' }}>{icon}</div>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: '#fff' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>{text}</p>
    </div>
  )
}

function InteractivePhone({ type }: { type: 'insta' | 'whats' }) {
  const [screen, setScreen] = useState<'home' | 'chat'>('home');

  // Cores atualizadas para Dark Mode
  const config = type === 'insta' ? {
    color: '#000',
    headerBg: '#000',
    textColor: '#fff',
    appName: 'Instagram',
    contactName: 'Julia',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    backColor: '#fff',
    chatBg: '#000'
  } : {
    color: '#0b141a',
    headerBg: '#202c33',
    textColor: '#fff',
    appName: 'WhatsApp',
    contactName: 'Amanda',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&q=80',
    backColor: '#00a884',
    chatBg: '#0b141a'
  };

  return (
    <div style={{
      position: 'relative', width: '300px', height: '600px',
      background: '#000', borderRadius: '45px', border: '6px solid #222',
      boxShadow: '0 30px 80px -10px rgba(0,0,0,0.8)', padding: '12px', overflow: 'hidden', cursor: 'pointer',
      transition: 'transform 0.3s ease'
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Notch */}
      <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '90px', height: '24px', background: '#000', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', zIndex: 10 }}></div>

      <div style={{ background: config.color, width: '100%', height: '100%', borderRadius: '32px', overflow: 'hidden', color: config.textColor, fontFamily: 'sans-serif', position: 'relative' }}>

        {/* TELA: HOME */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: screen === 'home' ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ padding: '35px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
            <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{config.appName}</div>
          </div>

          <div style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
            <div onClick={() => setScreen('chat')}
              style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', position: 'relative', overflow: 'hidden' }}>
                <img src={config.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {type === 'insta' && <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888, #8a3ab9) border-box', mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', opacity: 0.8 }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  {config.contactName}
                  <span style={{ fontSize: '0.7rem', color: '#666' }}>19:42</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                  {type === 'insta' ? 'Enviou uma foto' : 'Oii, trabalhando mt'}
                </div>
              </div>
              {type === 'insta' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3797f0' }}></div>}
            </div>
          </div>

          <div style={{ marginTop: 'auto', padding: '20px', textAlign: 'center', color: '#444', fontSize: '0.75rem' }}>
            Toque para ver o desastre 👇
          </div>
        </div>

        {/* TELA: CHAT */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: screen === 'chat' ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          display: 'flex', flexDirection: 'column',
          background: config.chatBg
        }}>
          <div style={{ background: config.headerBg, padding: '35px 15px 10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div onClick={() => setScreen('home')} style={{ fontSize: '1.2rem', cursor: 'pointer', color: config.backColor }}>←</div>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', overflow: 'hidden' }}>
              <img src={config.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{config.contactName}</div>
          </div>

          {/* CONTEÚDO */}
          {type === 'insta' ? (
            <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ alignSelf: 'flex-end', background: '#3797f0', padding: '8px 12px', borderRadius: '18px 18px 4px 18px', fontSize: '0.85rem' }}>oii</div>
              <div style={{ alignSelf: 'flex-start', background: '#262626', padding: '8px 12px', borderRadius: '18px 18px 18px 4px', fontSize: '0.85rem' }}>oi</div>
              <div style={{ alignSelf: 'flex-end', background: '#3797f0', padding: '8px 12px', borderRadius: '18px 18px 4px 18px', fontSize: '0.85rem' }}>tudo bem cntg?</div>
              <div style={{ alignSelf: 'flex-start', background: '#262626', padding: '8px 12px', borderRadius: '18px 18px 18px 4px', fontSize: '0.85rem' }}>tudo sim, e vc?</div>
              <div style={{ alignSelf: 'flex-end', background: '#3797f0', padding: '8px 12px', borderRadius: '18px 18px 4px 18px', fontSize: '0.85rem' }}>tudo bem tbm</div>
              <div style={{ alignSelf: 'flex-end', fontSize: '0.65rem', color: '#666' }}>Visto</div>

              <div style={{ marginTop: '2rem', textAlign: 'center', color: '#ef4444', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', opacity: 0.8 }}>MORREU O ASSUNTO</div>
            </div>
          ) : (
            <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover', opacity: 0.8 }}>
              <div style={{ alignSelf: 'flex-end', background: '#005c4b', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', maxWidth: '85%', boxShadow: '0 1px 1px rgba(0,0,0,0.3)' }}>
                Oii, peguei seu número lá no insta! Sou eu, o Lucas
                <div style={{ fontSize: '0.6rem', color: '#6fb0a5', textAlign: 'right', marginTop: '2px' }}>19:42 vv</div>
              </div>
              <div style={{ alignSelf: 'flex-start', background: '#202c33', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', maxWidth: '85%', boxShadow: '0 1px 1px rgba(0,0,0,0.3)' }}>
                Aah oi! Salvei aqui 😉
                <div style={{ fontSize: '0.6rem', color: '#8696a0', textAlign: 'right', marginTop: '2px' }}>19:45</div>
              </div>
              <div style={{ alignSelf: 'flex-end', background: '#005c4b', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', maxWidth: '85%', boxShadow: '0 1px 1px rgba(0,0,0,0.3)' }}>
                E aí, como tá o dia?
                <div style={{ fontSize: '0.6rem', color: '#6fb0a5', textAlign: 'right', marginTop: '2px' }}>19:46 vv</div>
              </div>
              <div style={{ alignSelf: 'flex-start', background: '#202c33', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', maxWidth: '85%', boxShadow: '0 1px 1px rgba(0,0,0,0.3)' }}>
                Corrido rs. E o seu?
                <div style={{ fontSize: '0.6rem', color: '#8696a0', textAlign: 'right', marginTop: '2px' }}>20:10</div>
              </div>
              <div style={{ alignSelf: 'flex-end', background: '#005c4b', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', maxWidth: '85%', boxShadow: '0 1px 1px rgba(0,0,0,0.3)' }}>
                Tranquilo por aqui.
                <div style={{ fontSize: '0.6rem', color: '#6fb0a5', textAlign: 'right', marginTop: '2px' }}>20:11 vv</div>
              </div>
              <div style={{ marginTop: '2rem', textAlign: 'center', color: '#eab308', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', background: 'rgba(0,0,0,0.6)', padding: '0.4rem', borderRadius: '4px' }}>MORREU O ASSUNTO</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
