
import { db } from './lib/db';

async function checkUser() {
    const user = await db.user.findUnique({
        where: {
            email: 'renandavilamoreira11@gmail.com'
        }
    });

    if (user) {
        console.log("Usuário ENCONTRADO:", user.email, "Hash da senha:", user.password.substring(0, 10) + "...");
    } else {
        console.log("Usuário NÃO encontrado.");
    }
}

checkUser()
    .catch(e => console.error(e))
    .finally(async () => {
        await db.$disconnect()
    })
