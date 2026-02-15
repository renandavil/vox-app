
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- DIAGNÓSTICO DO BANCO DE DADOS ---");

    const users = await prisma.user.findMany();
    console.log(`\n1. USUÁRIOS (${users.length}):`);
    users.forEach(u => {
        console.log(` - ${u.email} | Premium: ${u.isPremium} | Usage: ${u.usageCount}`);
    });

    const devices = await prisma.deviceUsage.findMany();
    console.log(`\n2. DISPOSITIVOS (${devices.length}):`);
    devices.forEach(d => {
        console.log(` - IP Hash: ${d.ipHash.substring(0, 10)}... | Usage: ${d.usageCount} | Last: ${d.lastUsedAt}`);
    });

    const logs = await prisma.analysisLog.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
    console.log(`\n3. ÚLTIMOS LOGS (${logs.length}):`);
    logs.forEach(l => {
        console.log(` - [${l.type}] ${l.createdAt.toISOString()} - User: ${l.userId}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
