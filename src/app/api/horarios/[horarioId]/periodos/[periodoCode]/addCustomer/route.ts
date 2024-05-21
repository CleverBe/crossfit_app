import prismadb from "@/lib/prismadb"
import { formatErrorsToResponse } from "@/lib/utils"
import { createCustomerSchemaServer } from "@/schemas/customer"
import { getCurrentDateYYYYMMDD } from "@/utils"
import { Descuento, Prisma } from "@prisma/client"
import { NextResponse } from "next/server"

// TODO: NO PERMITIR CREAR UN PLAN PARA UN CLIENTE QUE YA TIENE UNO ACTIVO

export const POST = async (
  req: Request,
  { params }: { params: { horarioId: string; periodoCode: string } },
) => {
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
    descuentoId,
  } = parseResult.data

  const currentDate = getCurrentDateYYYYMMDD()

  try {
    const periodo = await prismadb.horarioPeriodo.findUnique({
      where: {
        periodo_horarioId: {
          periodo: params.periodoCode,
          horarioId: params.horarioId,
        },
      },
    })

    if (!periodo) {
      return NextResponse.json(
        { message: "Periodo not found" },
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
          fecha_de_pago: currentDate,
          monto: resultadoCosto,
        },
      })

      const plan = await tx.plan.create({
        data: {
          clienteId: customer.id,
          tipoDePlanId: tipoDePlan.id,
          fecha_inscripcion: currentDate,
          fecha_inicio,
          fecha_fin,
          peso_cliente,
          estatura_cliente: estatura,
          horarioPeriodoId: periodo.id,
          descuentoId: descuento?.id,
          pagoId: pagoCliente.id,
        },
        include: {
          tipoDePlan: true,
          cliente: true,
          descuento: true,
          pago: true,
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
