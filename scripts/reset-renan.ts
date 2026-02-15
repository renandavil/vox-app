
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = "renandavilamoreira11@gmail.com";
    console.log(`Resetando usuário ${email}...`);

    await prisma.user.update({
        where: { email: email },
        data: {
            isPremium: false,
            usageCount: 0
        }
    });

    console.log("Feito! Usuário agora é FREE e com 0 usos.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
