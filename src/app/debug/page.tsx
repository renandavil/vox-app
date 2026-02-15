
"use client";
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";

export default function DebugPage() {
    const { data: session, status } = useSession();
    const [manualSession, setManualSession] = useState<any>(null);

    useEffect(() => {
        fetch('/api/user/status').then(res => res.json()).then(setManualSession);
    }, []);

    return (
        <div style={{ background: '#000', color: '#fff', height: '100vh', padding: '2rem' }}>
            <h1>Debug de Login 🕵️‍♂️</h1>

            <div style={{ padding: '1rem', border: '1px solid #333', margin: '1rem 0' }}>
                <h2>1. Sessão Google (NextAuth)</h2>
                <pre>{JSON.stringify({ status, session }, null, 2)}</pre>
            </div>

            <div style={{ padding: '1rem', border: '1px solid #333', margin: '1rem 0' }}>
                <h2>2. Sessão Manual ( /api/user/status )</h2>
                <pre>{JSON.stringify(manualSession, null, 2)}</pre>
            </div>

            <p>Admin esperado: <strong>renandavilamoreira11@gmail.com</strong></p>
        </div>
    );
}
