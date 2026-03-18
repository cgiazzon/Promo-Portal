import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

const ADMIN_EMAIL = "eduardo@oversaas.net";
const ADMIN_PASSWORD = "123456@7";

async function seedAdmin() {
  console.log("Verificando usuário admin...");

  const [existing] = await db
    .select({ id: usersTable.id, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.email, ADMIN_EMAIL))
    .limit(1);

  if (existing) {
    console.log(`Admin já existe (id=${existing.id}). Atualizando senha...`);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await db
      .update(usersTable)
      .set({ password: passwordHash, role: "admin", status: "active" })
      .where(eq(usersTable.id, existing.id));
    console.log("Senha do admin atualizada.");
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const [admin] = await db
    .insert(usersTable)
    .values({
      name: "Eduardo Admin",
      email: ADMIN_EMAIL,
      password: passwordHash,
      phone: "(11) 99999-0000",
      role: "admin",
      status: "active",
      trialEndsAt: null,
    })
    .returning();

  console.log(`Admin criado com sucesso! id=${admin.id}, email=${admin.email}`);
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Erro ao criar admin:", e);
    process.exit(1);
  });
