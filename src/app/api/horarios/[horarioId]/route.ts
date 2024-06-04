import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { formatErrorsToResponse } from "@/lib/utils"
import { updateHorarioSchemaServer } from "@/schemas/horarios"
import { Estado, Turno } from "@prisma/client"
import { checkForConflict, compareTimes } from "@/utils"
import { getSessionServerSide } from "@/lib/getSession"

export const GET = async (
  req: Request,
  { params }: { params: { horarioId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

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
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

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
      include: {
        horarioPeriodos: true,
      },
    })

    if (!horarioFound) {
      return NextResponse.json(
        { messsage: "Horario not found" },
        { status: 404 },
      )
    }

    // Check if new hora_inicio  is valid
    if (hora_inicio) {
      const isValid = compareTimes(hora_inicio, horarioFound.hora_fin)

      if (!isValid) {
        return NextResponse.json(
          { message: "La hora inicial debe ser anterior a la hora final" },
          { status: 400 },
        )
      }
    }

    // Check if new hora_fin  is valid
    if (hora_fin) {
      const isValid = compareTimes(horarioFound.hora_inicio, hora_fin)

      if (!isValid) {
        return NextResponse.json(
          { message: "La hora final debe ser posterior a la hora inicial" },
          { status: 400 },
        )
      }
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

    if (horarioFound.horarioPeriodos.length > 0) {
      return NextResponse.json(
        {
          message:
            "No es posible actualizar el horario ya que existen registros relacionados a este horario, cree otro horario",
        },
        { status: 400 },
      )
    }

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
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

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
