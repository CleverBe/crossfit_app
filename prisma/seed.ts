import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const users = [
  {
    nombre: "Carlos Perez",
    email: "carlos@gmail.com",
    role: Role.ADMIN,
    password: "carlos",
  },
]

async function main() {
  console.log("Seeding users ...")

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10)

    const newUser = await prisma.usuario.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, password: hashedPassword },
    })

    console.log(`Created user ${newUser.nombre}`)
  }

  console.log("Seeding finished")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
