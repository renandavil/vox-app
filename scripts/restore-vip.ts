
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = "renandavilamoreira11@gmail.com";
    console.log(`Restaurando VIP para ${email}...`);

    await prisma.user.update({
        where: { email: email },
        data: {
            isPremium: true,
            // Mantém o usageCount como está ou reseta? Vou deixar como está para histórico.
        }
    });

    console.log("Feito! 👑 VIP Restaurado.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
