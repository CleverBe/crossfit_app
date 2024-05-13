import prismadb from "@/lib/prismadb"
import { formatErrorsToResponse } from "@/lib/utils"
import { createCustomerSchemaServer } from "@/schemas/customer"
import { getCurrentDateYYYYMMDD } from "@/utils"
import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"

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
    nombre,
    apellido,
    genero,
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

    const descuento = await prismadb.descuento.findUnique({
      where: {
        id: descuentoId,
      },
    })

    if (!descuento) {
      return NextResponse.json(
        { message: "Descuento not found" },
        { status: 404 },
      )
    }

    const data = await prismadb.$transaction(async (tx) => {
      const customer = await tx.cliente.create({
        data: {
          nombre,
          apellido,
          celular,
          fecha_nacimiento,
          genero,
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
          descuentoId: descuento.id,
        },
        include: {
          tipoDePlan: true,
          cliente: true,
          descuento: true,
        },
      })

      const costoDelPlan = +tipoDePlan.costo

      const porcentaje = +descuento.porcentaje

      const valorPorcentaje = (porcentaje / 100) * costoDelPlan

      const resultadoCosto = costoDelPlan - valorPorcentaje

      const pagoCliente = await tx.pago.create({
        data: {
          tipo_de_pago: tipoDePago,
          planId: plan.id,
          fecha_de_pago: currentDate,
          monto: resultadoCosto,
        },
      })

      return { plan, pagoCliente }
    })

    return NextResponse.json(data)
  } catch (error) {
    console.log("[PERIODOS-ADD-CUSTOMER]", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // @ts-ignore
        if (error.meta?.target.includes("nombre")) {
          return NextResponse.json(
            { message: "Usuario con este nombre ya existe" },
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
