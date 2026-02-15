"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserActions({ user }: { user: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleAction = async (action: 'toggle_premium' | 'reset_usage' | 'delete_user') => {
        if (!confirm("Tem certeza que deseja realizar esta ação?")) return;
        setLoading(true);
        try {
            const res = await fetch("/api/admin/actions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, userId: user.id }),
            });

            if (!res.ok) throw new Error("Falha na ação");

            alert("Sucesso!");
            router.refresh(); // Recarrega os dados da página
        } catch (error) {
            alert("Erro ao executar ação.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2 justify-end">
            <button
                onClick={() => handleAction('toggle_premium')}
                disabled={loading}
                className={`p-2 rounded-lg text-xs font-bold transition-all ${user.isPremium
                        ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                    }`}
                title={user.isPremium ? "Remover Premium" : "Dar Premium"}
            >
                {loading ? "..." : user.isPremium ? "⬇️ Free" : "💎 Vip"}
            </button>

            <button
                onClick={() => handleAction('reset_usage')}
                disabled={loading}
                className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold hover:bg-blue-500/20 transition-all"
                title="Resetar contagem de uso (Zerar)"
            >
                🔄 Reset
            </button>

            <button
                onClick={() => handleAction('delete_user')}
                disabled={loading}
                className="p-2 bg-red-900/20 text-red-500 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-all"
                title="Excluir Usuário"
            >
                🗑️
            </button>
        </div>
    );
}
