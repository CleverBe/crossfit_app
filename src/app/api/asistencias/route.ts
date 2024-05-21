import prismadb from "@/lib/prismadb"
import { formatErrorsToResponse } from "@/lib/utils"
import { createAsistenciaSchemaServer } from "@/schemas/asistencias"
import { getCurrentDateYYYYMMDD, getDifferenceInDays } from "@/utils"
import { Asistencias, PlanEstado } from "@prisma/client"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
  try {
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
      },
    })

    if (!currentPlan) {
      return NextResponse.json(
        { message: "El cliente no tiene un plan activo o no existe" },
        { status: 400 },
      )
    }

    const currentDate = getCurrentDateYYYYMMDD()

    const lastAsistencia: Asistencias | undefined = currentPlan.asistencias[0]

    if (lastAsistencia) {
      const diferenciaDias = getDifferenceInDays(
        currentDate,
        lastAsistencia.fecha,
      )

      if (diferenciaDias === 0) {
        return NextResponse.json(
          { message: "Ya se ha registrado una asistencia hoy" },
          { status: 400 },
        )
      }
    }

    const newAsistencia = await prismadb.asistencias.create({
      data: {
        fecha: currentDate,
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
