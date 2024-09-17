import { getSessionServerSide } from "@/lib/getSession"
import prismadb from "@/lib/prismadb"
import { formatErrorsToResponse } from "@/lib/utils"
import { createCustomerSchemaServer } from "@/schemas/customer"
import { Descuento, Prisma } from "@prisma/client"
import { NextResponse } from "next/server"

export const GET = async (req: Request) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const planes = await prismadb.plan.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        cliente: true,
        descuento: true,
        tipoDePlan: true,
        pago: true,
        horario: true,
      },
    })

    return NextResponse.json(planes)
  } catch (error) {
    console.log("[PLANES-GET]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}

export const POST = async (req: Request) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate body
    const parseResult = createCustomerSchemaServer.safeParse(body)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const {
      nombre_completo,
      genero,
      cedula,
      celular,
      fecha_nacimiento,
      fecha_inicio,
      fecha_fin,
      peso_cliente,
      estatura,
      tipoDePago,
      tipoDePlanId,
      horarioId,
      instructorId,
      descuentoId,
      back_squat,
      bench_press,
      press_strit,
      clean,
      front_squat,
      push_press,
      thuster,
      dead_lift,
      snatch,
      squat,
      sit_ups,
      pushups,
      su,
      burpees,
      wall_sit,
      plank,
      fourHundredMts,
    } = parseResult.data

    const horario = await prismadb.horario.findUnique({
      where: {
        id: horarioId,
      },
    })

    if (!horario) {
      return NextResponse.json(
        { message: "Horario not found" },
        { status: 404 },
      )
    }

    const instructor = await prismadb.instructor.findUnique({
      where: {
        id: instructorId,
      },
    })

    if (!instructor) {
      return NextResponse.json(
        { message: "Instructor not found" },
        { status: 404 },
      )
    }

    const tipoDePlan = await prismadb.tipoDePlan.findUnique({
      where: {
        id: tipoDePlanId,
      },
    })

    if (!tipoDePlan) {
      return NextResponse.json(
        { message: "TipoDePlan not found" },
        { status: 404 },
      )
    }

    let descuento: Descuento | null = null

    if (descuentoId) {
      descuento = await prismadb.descuento.findUnique({
        where: {
          id: descuentoId,
        },
      })

      if (!descuento) {
        return NextResponse.json(
          { message: "Descuento not found / descuentoId is optional" },
          { status: 404 },
        )
      }
    }

    // GET CUSTOMER IF ALREADY EXISTS
    const customer = await prismadb.cliente.findUnique({
      where: {
        nombre_completo_cedula: {
          nombre_completo,
          cedula,
        },
      },
    })

    // CHECK IF CUSTOMER HAS ACTIVE PLAN
    if (customer) {
      const userActivePlan = await prismadb.plan.findFirst({
        where: {
          clienteId: customer.id,
          estado: "VIGENTE",
        },
      })

      if (userActivePlan) {
        return NextResponse.json(
          { message: "El cliente ya tiene un plan activo" },
          { status: 400 },
        )
      }
    }

    const data = await prismadb.$transaction(async (tx) => {
      const customer = await tx.cliente.upsert({
        where: {
          nombre_completo_cedula: {
            nombre_completo,
            cedula,
          },
        },
        update: {
          celular,
          fecha_nacimiento,
          genero,
          peso: peso_cliente,
          estatura,
        },
        create: {
          nombre_completo,
          celular,
          cedula,
          fecha_nacimiento,
          genero,
          peso: peso_cliente,
          estatura,
        },
      })

      let resultadoCosto = +tipoDePlan.costo

      if (descuento) {
        const costoDelPlan = +tipoDePlan.costo

        const porcentaje = +descuento.porcentaje

        const valorPorcentaje = (porcentaje / 100) * costoDelPlan

        resultadoCosto = costoDelPlan - valorPorcentaje
      }

      const pagoCliente = await tx.pago.create({
        data: {
          tipo_de_pago: tipoDePago,
          fecha_de_pago: new Date(),
          monto: resultadoCosto,
        },
      })

      const estadisticasCliente = await tx.estadisticas.create({
        data: {
          back_squat: back_squat || "",
          bench_press: bench_press || "",
          press_strit: press_strit || "",
          clean: clean || "",
          front_squat: front_squat || "",
          push_press: push_press || "",
          thuster: thuster || "",
          dead_lift: dead_lift || "",
          snatch: snatch || "",
          squat: squat || "",
          sit_ups: sit_ups || "",
          pushups: pushups || "",
          su: su || "",
          burpees: burpees || "",
          wall_sit:
            wall_sit && wall_sit.minutes && wall_sit.seconds
              ? `${wall_sit.minutes}:${wall_sit.seconds}`
              : "",
          plank:
            plank && plank.minutes && plank.seconds
              ? `${plank.minutes}:${plank.seconds}`
              : "",
          fourHundredMts:
            fourHundredMts && fourHundredMts.minutes && fourHundredMts.seconds
              ? `${fourHundredMts.minutes}:${fourHundredMts.seconds}`
              : "",
        },
      })

      const plan = await tx.plan.create({
        data: {
          clienteId: customer.id,
          tipoDePlanId: tipoDePlan.id,
          fecha_inscripcion: new Date(),
          fecha_inicio,
          fecha_fin,
          peso_cliente,
          estatura_cliente: estatura,
          horarioId: horario.id,
          instructorId: instructor.id,
          descuentoId: descuento?.id,
          pagoId: pagoCliente.id,
          estadisticasId: estadisticasCliente.id,
        },
        include: {
          tipoDePlan: true,
          cliente: true,
          descuento: true,
          pago: true,
          horario: true,
        },
      })

      return plan
    })

    return NextResponse.json(data)
  } catch (error) {
    console.log("[PERIODOS-ADD-CUSTOMER]", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // @ts-ignore
        if (error.meta?.target.includes("cedula")) {
          return NextResponse.json(
            { message: "Usuario con esa cedula ya existe" },
            { status: 400 },
          )
        }
      }
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
