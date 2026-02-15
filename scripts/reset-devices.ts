
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Limpando tabela DeviceUsage (Reset Total de IPs)...");
    await prisma.deviceUsage.deleteMany({});
    console.log("Tabela DeviceUsage limpa! Todos os IPs estão zerados.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
