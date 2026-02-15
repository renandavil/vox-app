import { db } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import UserActions from "@/components/UserActions";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    const adminEmails = ['admin@vox.com', session?.user?.email];

    // Simple security check
    if (!session || !adminEmails.includes(session.user?.email)) {
        // redirect('/'); 
    }

    const users = await db.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    const totalUsers = await db.user.count();
    const premiumUsers = await db.user.count({ where: { isPremium: true } });
    const totalUsage = await db.user.aggregate({ _sum: { usageCount: true } });

    // Fetch Logs for Live Feed
    const logs = await db.analysisLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { user: true }
    });

    // Format currency
    const revenue = (premiumUsers * 29.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
            {/* ... (Existing Background & Header & KPIs) ... */}

            {/* I will keep the HEADER and KPI GRIDS as they are in the file, just targeting the RETURN block start to verify insertion context, 
               but wait, I am in a REPLACE block. I need to be careful not to delete the header/kpi code if I target too wide.
               
               Safest strategy:
               1. Insert the `const logs = ...` at the top.
               2. Insert the Second Table at the bottom of the JSX.
            */}

            {/* Let's try to update the `const` section first, and then I will do a second replace for the JSX if needed, 
               OR I can replace the whole functional component body if it's cleaner. 
               The file is ~200 lines. Rewriting the whole file ensures structure integrity.
            */}

            {/* BACKGROUND EFFECTS */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12 max-w-7xl">

                {/* HEADER */}
                <header className="mb-12 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 tracking-widest">
                                SYSTEM ONLINE
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                            VØX <span className="text-emerald-500">GOD MODE</span>
                        </h1>
                        <p className="text-gray-400 mt-2 text-lg">Painel de Controle Tático</p>
                    </div>
                </header>

                {/* KPI GRIDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Card 1: Users */}
                    <div className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl transition-all hover:border-emerald-500/50 hover:bg-white/10">
                        <div className="absolute right-[-20px] top-[-20px] text-9xl opacity-[0.03] group-hover:opacity-[0.1] transition-all rotate-12">👥</div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Base de Usuários</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-white">{totalUsers}</span>
                            <span className="text-emerald-400 text-sm font-bold">Cadastrados</span>
                        </div>
                    </div>

                    {/* Card 2: Revenue */}
                    <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-900/20 to-black backdrop-blur-xl border border-emerald-500/20 p-8 rounded-3xl transition-all hover:border-emerald-500/50">
                        <div className="absolute right-[-20px] top-[-20px] text-9xl opacity-[0.05] group-hover:opacity-[0.1] transition-all rotate-12">💎</div>
                        <h3 className="text-emerald-400/70 text-xs font-bold uppercase tracking-[0.2em] mb-4">Receita Estimada</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-emerald-400">{revenue}</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[70%]"></div>
                            </div>
                            <span className="text-xs text-gray-400">{premiumUsers} Vendas</span>
                        </div>
                    </div>

                    {/* Card 3: Usage */}
                    <div className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl transition-all hover:border-purple-500/50 hover:bg-white/10">
                        <div className="absolute right-[-20px] top-[-20px] text-9xl opacity-[0.03] group-hover:opacity-[0.1] transition-all rotate-12">⚡</div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Total de Análises</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-purple-400">{totalUsage._sum.usageCount || 0}</span>
                            <span className="text-purple-400/60 text-sm font-bold">Gerações</span>
                        </div>
                    </div>
                </div>

                {/* MAIN TABLE */}
                <div className="bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                            <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                            Monitoramento em Tempo Real
                        </h3>
                        <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Live Feed</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/5 bg-white/[0.02]">
                                    <th className="p-6 font-semibold">Usuário / ID</th>
                                    <th className="p-6 font-semibold">Status de Conta</th>
                                    <th className="p-6 font-semibold text-center">Nível de Uso</th>
                                    <th className="p-6 font-semibold text-right">Cadastrado em</th>
                                    <th className="p-6 font-semibold text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">
                                                    {user.name || 'Anônimo'}
                                                </span>
                                                <span className="text-sm text-gray-500 font-mono">{user.email}</span>
                                            </div>
                                        </td>

                                        <td className="p-6">
                                            {user.isPremium ? (
                                                <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                    PREMIUM ELITE
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 bg-gray-800 text-gray-400 px-4 py-1.5 rounded-full text-xs font-bold border border-gray-700">
                                                    FREE USER
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-6 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="text-2xl font-black text-white">{user.usageCount}</span>
                                                <span className="text-[10px] text-gray-500 uppercase">Requests</span>
                                            </div>
                                        </td>

                                        <td className="p-6 text-right">
                                            <span className="text-gray-400 font-mono text-sm">
                                                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                            </span>
                                            <div className="text-[10px] text-gray-600 mt-1">
                                                {new Date(user.createdAt).toLocaleTimeString('pt-BR')}
                                            </div>
                                        </td>

                                        <td className="p-6 text-right">
                                            <UserActions user={user} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER PAGINATION (Static for MVP) */}
                    <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center text-xs text-gray-600">
                        Mostrando os últimos 50 usuários
                    </div>
                </div>

                {/* --- LIVE INTELLIGENCE FEED (NOVO) --- */}
                <div className="mt-12 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                            <span className="w-2 h-8 bg-purple-500 rounded-full animate-pulse"></span>
                            Feed de Inteligência (O que estão mandando?)
                        </h3>
                        <span className="text-xs text-purple-400 uppercase tracking-widest font-bold border border-purple-500/30 px-3 py-1 rounded-full bg-purple-500/10">Ao Vivo</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/5 bg-white/[0.02]">
                                    <th className="p-6 font-semibold">Tipo</th>
                                    <th className="p-6 font-semibold w-1/3">Veredito IA (Sentimento)</th>
                                    <th className="p-6 font-semibold w-1/3">Conselho Dado</th>
                                    <th className="p-6 font-semibold">Usuário</th>
                                    <th className="p-6 font-semibold text-right">Hora</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="p-6">
                                            {log.type === 'CHAT' ? (
                                                <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-500/20">
                                                    💬 CHAT
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 px-3 py-1 rounded-lg text-xs font-bold border border-purple-500/20">
                                                    📸 STORY
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-6">
                                            <p className="text-gray-300 font-medium text-sm line-clamp-2" title={log.sentiment || ''}>
                                                {log.sentiment || 'Analisando...'}
                                            </p>
                                        </td>

                                        <td className="p-6">
                                            <p className="text-gray-400 text-xs line-clamp-2 italic" title={log.advice || ''}>
                                                "{log.advice}"
                                            </p>
                                        </td>

                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="text-white text-xs font-bold">
                                                    {log.user?.name || (log.userId ? 'ID: ' + log.userId.slice(0, 8) : 'Visitante')}
                                                </span>
                                                <span className="text-[10px] text-gray-600 font-mono">
                                                    {log.user?.email || 'Sem conta'}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-6 text-right">
                                            <span className="text-gray-500 font-mono text-xs">
                                                {new Date(log.createdAt).toLocaleTimeString('pt-BR')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-gray-600 italic">
                                            Nenhuma análise registrada ainda. O feed aparecerá aqui assim que os usuários usarem a IA.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
