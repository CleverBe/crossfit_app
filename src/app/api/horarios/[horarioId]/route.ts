import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { formatErrorsToResponse } from "@/lib/utils"
import { updateHorarioSchemaServer } from "@/schemas/horarios"
import { Estado, Turno } from "@prisma/client"
import { checkForConflict } from "@/utils"

export const GET = async (
  req: Request,
  { params }: { params: { horarioId: string } },
) => {
  try {
    const horario = await prismadb.horario.findUnique({
      where: {
        id: params.horarioId,
      },
    })

    if (!horario) {
      return NextResponse.json(
        { message: "Horario not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(horario)
  } catch (error) {
    console.log("[HORARIO-GET]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}

export const PATCH = async (
  req: Request,
  { params }: { params: { horarioId: string } },
) => {
  try {
    const body = await req.json()

    // Validate body
    const parseResult = updateHorarioSchemaServer.safeParse(body)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { hora_inicio, hora_fin, estado } = parseResult.data

    // Check if horario exists
    const horarioFound = await prismadb.horario.findUnique({
      where: { id: params.horarioId },
    })

    if (!horarioFound) {
      return NextResponse.json(
        { messsage: "Horario not found" },
        { status: 404 },
      )
    }

    // Check if there is a conflict
    if (hora_inicio || hora_fin) {
      const horariosActivos = await prismadb.horario.findMany({
        where: {
          estado: Estado.ACTIVO,
          id: {
            not: params.horarioId,
          },
        },
      })

      const conflicto = checkForConflict(
        horariosActivos,
        hora_inicio || horarioFound.hora_inicio,
        hora_fin || horarioFound.hora_fin,
      )

      if (conflicto) {
        return NextResponse.json(
          { message: "There is a conflict with an existing schedule" },
          { status: 400 },
        )
      }
    }
    // TODO: No permitir al usuario actualizar los horarios si hay periodo_horarios porque romperia la integridad
    // en caso quiera actualizar enviar mensaje de que cree otro horario

    // Update turno if hora_inicio is provided based on hora_inicio
    let turno: undefined | Turno = undefined

    if (hora_inicio) {
      const hora_turno = +hora_inicio.substring(0, 2)

      turno =
        hora_turno < 12
          ? Turno.MANANA
          : hora_turno < 18
            ? Turno.TARDE
            : Turno.NOCHE
    }

    const horario = await prismadb.horario.update({
      where: {
        id: params.horarioId,
      },
      data: {
        hora_inicio,
        hora_fin,
        turno,
        estado,
      },
    })

    return NextResponse.json(horario)
  } catch (error) {
    console.log("[HORARIO-PATCH]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}

export const DELETE = async (
  req: Request,
  { params }: { params: { horarioId: string } },
) => {
  try {
    const horarioFound = await prismadb.horario.findUnique({
      where: { id: params.horarioId },
    })

    if (!horarioFound) {
      return NextResponse.json(
        { message: "Horario not found" },
        { status: 404 },
      )
    }

    await prismadb.horario.delete({
      where: {
        id: params.horarioId,
      },
    })

    return NextResponse.json({})
  } catch (error) {
    console.log("[HORARIO-DELETE]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
