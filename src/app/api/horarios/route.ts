import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { formatErrorsToResponse } from "@/lib/utils"
import { createHorarioSchemaServer } from "@/schemas/horarios"
import { Estado, Turno } from "@prisma/client"
import { checkForConflict } from "@/utils"
import { getSessionServerSide } from "@/lib/getSession"

export const GET = async (req: Request) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const horarios = await prismadb.horario.findMany({
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json({ horarios })
  } catch (error) {
    console.log("[HORARIOS-GET]", error)
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
    const parseResult = createHorarioSchemaServer.safeParse(body)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { hora_inicio, hora_fin } = parseResult.data

    // Check if horario with same time exists
    const horariosActivos = await prismadb.horario.findMany({
      where: {
        estado: Estado.ACTIVO,
      },
    })

    const conflicto = checkForConflict(horariosActivos, hora_inicio, hora_fin)

    if (conflicto) {
      return NextResponse.json(
        { message: "There is a conflict with an existing schedule" },
        { status: 400 },
      )
    }

    // Update turno if hora_inicio is provided based on hora_inicio
    const hora_turno = +hora_inicio.substring(0, 2)

    const turno =
      hora_turno < 12
        ? Turno.MANANA
        : hora_turno < 18
          ? Turno.TARDE
          : Turno.NOCHE

    // Create horario
    const horario = await prismadb.horario.create({
      data: {
        hora_inicio,
        hora_fin,
        turno,
      },
    })

    return NextResponse.json(horario)
  } catch (error) {
    console.log("[HORARIOS-POST]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
