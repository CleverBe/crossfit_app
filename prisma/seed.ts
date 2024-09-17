import { CreateDescuentoInputClient } from "@/schemas/descuentos"
import { CreateHorarioInput } from "@/schemas/horarios"
import { CreateInstructorInput } from "@/schemas/instructores"
import { CreateTipoDePlanInputServer } from "@/schemas/tipoDePlanes"
import { Dias, PrismaClient, Role, Turno } from "@prisma/client"
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

const instructores: CreateInstructorInput[] = [
  {
    nombre: "Luis",
    apellido: "Gonzalez",
    email: "luis@gmail.com",
    genero: "MASCULINO",
    celular: "61400001",
  },
  {
    nombre: "Maria",
    apellido: "Perez",
    email: "maria@gmail.com",
    genero: "FEMENINO",
    celular: "61400002",
  },
  {
    nombre: "Pedro",
    apellido: "Garcia",
    email: "pedro@gmail.com",
    genero: "MASCULINO",
    celular: "61400003",
  },
  {
    nombre: "Ana",
    apellido: "Sanchez",
    email: "ana@gmail.com",
    genero: "FEMENINO",
    celular: "61400004",
  },
]

const horarios: CreateHorarioInput[] = [
  {
    hora_inicio: "17:00",
    hora_fin: "18:00",
  },
  {
    hora_inicio: "18:00",
    hora_fin: "19:00",
  },
  {
    hora_inicio: "19:00",
    hora_fin: "20:00",
  },
  {
    hora_inicio: "20:00",
    hora_fin: "21:00",
  },
  {
    hora_inicio: "21:00",
    hora_fin: "22:00",
  },
]

const tiposDePlanes: CreateTipoDePlanInputServer[] = [
  {
    tipo: "Completo",
    cantidadDeClases: 20,
    costo: 200,
    dias: [Dias.LUNES, Dias.MARTES, Dias.MIERCOLES, Dias.JUEVES, Dias.VIERNES],
  },
  {
    tipo: "Regular",
    cantidadDeClases: 12,
    costo: 150,
    dias: [Dias.LUNES, Dias.MIERCOLES, Dias.VIERNES],
  },
]

const descuentos: CreateDescuentoInputClient[] = [
  { titulo: "Descuento por pareja", porcentaje: 10 },
  { titulo: "Descuento por familia", porcentaje: 15 },
  { titulo: "Descuento antiguedad", porcentaje: 10 },
]

const seedUsers = async () => {
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
}

const seedInstructores = async () => {
  console.log("Seeding instructores ...")

  for (const instructor of instructores) {
    const newInstructor = await prisma.instructor.upsert({
      where: { email: instructor.email },
      update: {},
      create: instructor,
    })

    console.log(`Created instructor ${newInstructor.nombre}`)
  }
}

const seedHorarios = async () => {
  console.log("Seeding horarios ...")

  for (const horario of horarios) {
    const hora_turno = +horario.hora_inicio.substring(0, 2)

    const turno =
      hora_turno < 12
        ? Turno.MANANA
        : hora_turno < 18
          ? Turno.TARDE
          : Turno.NOCHE

    const newHorario = await prisma.horario.upsert({
      where: {
        hora_inicio_hora_fin: {
          hora_inicio: horario.hora_inicio,
          hora_fin: horario.hora_fin,
        },
      },
      update: {},
      create: { ...horario, turno },
    })

    console.log(
      `Created horario ${newHorario.hora_inicio}-${newHorario.hora_fin}`,
    )
  }
}

const seedTiposDePlanes = async () => {
  console.log("Seeding tipos de planes ...")

  for (const tipoDePlan of tiposDePlanes) {
    const newTipoDePlan = await prisma.tipoDePlan.upsert({
      where: { tipo: tipoDePlan.tipo },
      update: {},
      create: {
        ...tipoDePlan,
        costo: +tipoDePlan.costo,
        cantidadDeClases: +tipoDePlan.cantidadDeClases,
      },
    })

    console.log(`Created tipo de plan ${newTipoDePlan.tipo}`)
  }
}

const seedDescuentos = async () => {
  console.log("Seeding descuentos ...")

  for (const descuento of descuentos) {
    const newDescuento = await prisma.descuento.upsert({
      where: { titulo: descuento.titulo },
      update: {},
      create: descuento,
    })

    console.log(`Created descuento ${newDescuento.titulo}`)
  }
}

async function main() {
  await seedUsers()

  await seedInstructores()

  await seedHorarios()

  await seedTiposDePlanes()

  await seedDescuentos()

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
