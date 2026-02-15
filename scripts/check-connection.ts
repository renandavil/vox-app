
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🛠️ Testando Conexão com Neon PostgreSQL...");
    try {
        const userCount = await prisma.user.count();
        console.log(`✅ Conexão Sucedida! Total de usuários no banco: ${userCount}`);

        const testUser = await prisma.user.create({
            data: {
                email: `test_neon_${Date.now()}@example.com`,
                name: "Test User Neon",
                image: "https://example.com/avatar.png",
                usageCount: 0,
                isPremium: false
            }
        });
        console.log(`✅ Usuário de teste criado com sucesso: ${testUser.id}`);
    } catch (error) {
        console.error("❌ ERRO DE CONEXÃO/CRIAÇÃO:", error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
