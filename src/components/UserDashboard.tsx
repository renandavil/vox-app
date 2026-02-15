"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function UserDashboard({ children, userEmail, isPremium }: { children: React.ReactNode, userEmail?: string, isPremium?: boolean }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#050505', color: '#fff' }}>

            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 40, backdropFilter: 'blur(5px)' }}
                ></div>
            )}

            {/* SIDEBAR */}
            <aside style={{
                width: '280px',
                background: '#0a0a0a',
                borderRight: '1px solid #1f1f1f',
                display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, bottom: 0, left: 0,
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', // Mobile Hidden by default
                transition: 'transform 0.3s ease',
                zIndex: 50,
                padding: '2rem 1.5rem',
            }} className="desktop-sidebar">

                {/* LOGO */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '3rem', paddingLeft: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 15px var(--primary)' }}></div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>VØX APP</span>
                </div>

                {/* NAV */}
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavItem href="/tool" icon="💬" label="Nova Análise" active />
                    <NavItem href="#" icon="📜" label="Histórico" disabled />
                    <NavItem href="#" icon="⭐" label="Favoritos" disabled />
                    <NavItem href="#" icon="⚙️" label="Configurações" disabled />
                </nav>

                {/* USER PROFILE */}
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #1f1f1f' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #333, #111)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                            👤
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {userEmail ? userEmail.split('@')[0] : 'Usuário'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: isPremium ? '#FFD700' : '#666', fontWeight: isPremium ? 'bold' : 'normal' }}>
                                {isPremium ? 'Plano Premium 👑' : 'Plano Gratuito'}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <div className="main-content-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

                {/* MOBILE HEADER */}
                <header style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid #1f1f1f',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(10px)',
                    position: 'sticky', top: 0, zIndex: 30
                }} className="mobile-header">
                    <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem' }}>☰</button>
                    <div style={{ fontWeight: 800 }}>VØX</div>
                    <div style={{ width: '24px' }}></div> {/* Spacer */}
                </header>

                {/* CONTENT */}
                <main style={{ flex: 1, padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                    {children}
                </main>
            </div>

            <style jsx>{`
                /* Responsive Logic */
                .desktop-sidebar { transform: translateX(0) !important; position: sticky !important; height: 100vh !important; }
                .mobile-header { display: none !important; }

                @media (max-width: 768px) {
                    .desktop-sidebar { position: fixed !important; transform: translateX(-100%) !important; }
                    .desktop-sidebar.open { transform: translateX(0) !important; }
                    .mobile-header { display: flex !important; }
                    .main-content-wrapper { padding-left: 0; }
                }
            `}</style>
        </div>
    );
}

function NavItem({ href, icon, label, active, disabled }: any) {
    return (
        <Link href={href} style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '0.8rem 1rem',
            borderRadius: '12px',
            textDecoration: 'none',
            color: active ? '#fff' : '#888',
            background: active ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
            border: active ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent',
            transition: 'all 0.2s',
            opacity: disabled ? 0.5 : 1,
            pointerEvents: disabled ? 'none' : 'auto',
            cursor: disabled ? 'default' : 'pointer'
        }}>
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{label}</span>
            {disabled && <span style={{ marginLeft: 'auto', fontSize: '0.6rem', border: '1px solid #333', padding: '2px 6px', borderRadius: '4px' }}>EM BREVE</span>}
        </Link>
    )
}
