
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = "renandavilamoreira11@gmail.com";
    console.log(`Simulando Pagamento Aprovado para ${email}...`);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error("Usuário não encontrado!");
        return;
    }

    console.log(`User ID: ${user.id}`);
    console.log("Recebendo Webhook do Mercado Pago: STATUS APPROVED ✔️");

    // Ativando VIP como se o Webhook tivesse rodado
    await prisma.user.update({
        where: { id: user.id },
        data: { isPremium: true }
    });

    console.log("✅ SUCESSO! O usuário agora é VIP (Pagamento Confirmado).");
    console.log("Pode atualizar a página do Dashboard/App.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
