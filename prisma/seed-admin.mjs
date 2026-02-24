/**
 * Seed: cria o usuário admin no banco de dados.
 * Executa uma vez: node prisma/seed-admin.mjs
 *
 * Lê as credenciais do .env.local via process.env.
 */

import { createRequire } from "module"
import { config } from "dotenv"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Carrega .env.local
config({ path: resolve(__dirname, "../.env.local") })
config({ path: resolve(__dirname, "../.env") })

const require = createRequire(import.meta.url)
const bcrypt  = require("bcryptjs")

// Importa o Prisma Client gerado no path customizado
const { PrismaClient } = await import("../lib/generated/prisma/index.js")
const prisma = new PrismaClient()

const EMAIL    = process.env.ADMIN_EMAIL    || "admin@icevans.com.br"
const PASSWORD = process.env.ADMIN_PASSWORD || "icevans@admin2025"
const NAME     = "Administrador"

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 12)

  const user = await prisma.user.upsert({
    where:  { email: EMAIL },
    update: { passwordHash, name: NAME },
    create: { email: EMAIL, passwordHash, name: NAME, role: "admin" },
  })

  console.log(`\n✅ Usuário admin criado/atualizado:`)
  console.log(`   ID:    ${user.id}`)
  console.log(`   Nome:  ${user.name}`)
  console.log(`   Email: ${user.email}`)
  console.log(`   Senha: ${PASSWORD}`)
  console.log(`   Role:  ${user.role}\n`)
}

main()
  .catch((e) => { console.error("❌ Erro:", e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
