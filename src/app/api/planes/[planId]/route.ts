import { getSessionServerSide } from "@/lib/getSession"
import prismadb from "@/lib/prismadb"
import { formatErrorsToResponse } from "@/lib/utils"
import { updatePlanSchemaServer } from "@/schemas/plan"
import { Descuento, TipoDePlan } from "@prisma/client"
import { NextResponse } from "next/server"

export const GET = async (
  req: Request,
  { params }: { params: { planId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const plan = await prismadb.plan.findUnique({
      where: {
        id: params.planId,
      },
      include: {
        cliente: true,
        tipoDePlan: true,
        descuento: true,
        pago: true,
        asistencias: true,
        horario: true,
      },
    })

    if (!plan) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 })
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.log("[PLAN-GET]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}

export const PUT = async (
  req: Request,
  { params }: { params: { planId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const parseResult = updatePlanSchemaServer.safeParse(body)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const {
      fecha_inicio,
      fecha_fin,
      peso_cliente,
      estatura,
      tipoDePago,
      tipoDePlanId,
      descuentoId,
    } = parseResult.data

    const planFound = await prismadb.plan.findUnique({
      where: { id: params.planId },
      include: {
        descuento: true,
        tipoDePlan: true,
      },
    })

    if (!planFound) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 })
    }

    let tipoDePlan: TipoDePlan | null = null

    if (tipoDePlanId) {
      tipoDePlan = await prismadb.tipoDePlan.findUnique({
        where: { id: tipoDePlanId },
      })

      if (!tipoDePlan) {
        return NextResponse.json(
          { message: "Tipo de plan not found" },
          { status: 404 },
        )
      }
    }

    let descuento: Descuento | null = null

    if (descuentoId) {
      descuento = await prismadb.descuento.findUnique({
        where: { id: descuentoId },
      })

      if (!descuento) {
        return NextResponse.json(
          { message: "Descuento not found" },
          { status: 404 },
        )
      }
    }

    const data = await prismadb.$transaction(async (tx) => {
      if (tipoDePlan && descuento) {
        let resultadoCosto = +tipoDePlan.costo

        const costoDelPlan = +tipoDePlan.costo

        const porcentaje = +descuento.porcentaje

        const valorPorcentaje = (porcentaje / 100) * costoDelPlan

        resultadoCosto = costoDelPlan - valorPorcentaje

        await tx.pago.update({
          where: {
            id: planFound.pagoId,
          },
          data: {
            tipo_de_pago: tipoDePago,
            monto: resultadoCosto,
          },
        })
      } else if (tipoDePlan) {
        const costoDelPlan = +tipoDePlan.costo

        await tx.pago.update({
          where: {
            id: planFound.pagoId,
          },
          data: {
            tipo_de_pago: tipoDePago,
            monto: costoDelPlan,
          },
        })
      } else if (descuento) {
        const costoDelPlan = +planFound.tipoDePlan.costo

        const porcentajeDescuento = +descuento.porcentaje

        const valorPorcentaje = (porcentajeDescuento / 100) * costoDelPlan

        const resultadoCosto = costoDelPlan - valorPorcentaje

        await tx.pago.update({
          where: {
            id: planFound.pagoId,
          },
          data: {
            tipo_de_pago: tipoDePago,
            monto: resultadoCosto,
          },
        })
      }

      const plan = await tx.plan.update({
        where: {
          id: params.planId,
        },
        data: {
          fecha_inicio,
          fecha_fin,
          peso_cliente: peso_cliente ?? null,
          estatura_cliente: estatura ?? null,
          tipoDePlanId,
          descuentoId: descuentoId ?? null,
        },
        include: {
          pago: true,
        },
      })

      return plan
    })

    return NextResponse.json(data)
  } catch (error) {
    console.log("[PLAN-PUT]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}

export const DELETE = async (
  req: Request,
  { params }: { params: { planId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const planFound = await prismadb.plan.findUnique({
      where: { id: params.planId },
    })

    if (!planFound) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 })
    }

    await prismadb.$transaction(async (tx) => {
      await tx.plan.delete({
        where: {
          id: params.planId,
        },
      })

      // DELETE PAGO BECAUSE PAGO IS NOT DELETED WITH PLAN
      await tx.pago.delete({
        where: {
          id: planFound.pagoId,
        },
      })
    })

    return NextResponse.json({})
  } catch (error) {
    console.log("[PLAN-DELETE]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
