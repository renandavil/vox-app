
import { db } from './lib/db';
import { hashPassword, verifyPassword } from './lib/auth';

async function resetPassword() {
    const email = 'renandavilamoreira11@gmail.com';
    const newPassword = 'Mariany(11)';

    console.log(`Resetando senha para usuário: ${email}`);

    // 1. Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // 2. Update the user
    await db.user.update({
        where: { email },
        data: { password: hashedPassword }
    });

    console.log("Senha atualizada no banco.");

    // 3. Verify immediately to ensure hashing works
    const updatedUser = await db.user.findUnique({ where: { email } });
    if (updatedUser) {
        const isValid = await verifyPassword(newPassword, updatedUser.password);
        console.log(`Verificação imediata: ${isValid ? 'SUCESSO ✅' : 'FALHA ❌'}`);
    }
}

resetPassword()
    .catch(e => console.error(e))
    .finally(async () => {
        await db.$disconnect()
    })
