import prismadb from "@/lib/prismadb"
import { formatErrorsToResponse } from "@/lib/utils"
import { createAsistenciaSchemaServer } from "@/schemas/asistencias"
import { PlanEstado } from "@prisma/client"
import { NextResponse } from "next/server"
import { getSessionServerSide } from "@/lib/getSession"

export const GET = async (req: Request) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const asistencias = await prismadb.asistencias.findMany({
      orderBy: {
        fecha: "desc",
      },
    })

    return NextResponse.json(asistencias)
  } catch (error) {
    console.log("[ASISTENCIAS-GET]", error)
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

    const parseResult = createAsistenciaSchemaServer.safeParse(body)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { codigo } = parseResult.data

    const cliente = await prismadb.cliente.findUnique({
      where: {
        cedula: codigo,
      },
    })

    if (!cliente) {
      return NextResponse.json(
        { message: "El cliente no tiene un plan activo o no existe" },
        { status: 400 },
      )
    }

    const currentPlan = await prismadb.plan.findFirst({
      where: {
        clienteId: cliente.id,
        estado: PlanEstado.VIGENTE,
      },
      include: {
        asistencias: {
          orderBy: {
            createdAt: "desc",
          },
        },
        tipoDePlan: true,
      },
    })

    if (!currentPlan) {
      return NextResponse.json(
        { message: "El cliente no tiene un plan activo o no existe" },
        { status: 400 },
      )
    }

    if (
      currentPlan.asistencias.length === currentPlan.tipoDePlan.cantidadDeClases
    ) {
      return NextResponse.json(
        {
          message: `Ya se han registrado todas las clases del plan`,
        },
        { status: 400 },
      )
    }

    if (currentPlan.asistencias.length > 0) {
      const lastAsistencia = currentPlan.asistencias[0]

      if (lastAsistencia) {
        const currentDate = new Date().toISOString().split("T")[0]
        const lastAsistenciaDate = lastAsistencia.fecha
          .toISOString()
          .split("T")[0]

        if (currentDate === lastAsistenciaDate) {
          return NextResponse.json(
            { message: "Ya se ha registrado una asistencia hoy" },
            { status: 400 },
          )
        }
      }
    }

    const newAsistencia = await prismadb.asistencias.create({
      data: {
        fecha: new Date(),
        planId: currentPlan.id,
      },
    })

    return NextResponse.json(newAsistencia)
  } catch (error) {
    console.log("[ASISTENCIA-POST]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
