import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { formatErrorsToResponse } from "@/lib/utils"
import { createPeriodoSchemaServer } from "@/schemas/periodos"
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

    const periodos = await prismadb.horarioPeriodo.findMany({
      where: {
        horarioId: params.horarioId,
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json(periodos)
  } catch (error) {
    console.log("[PERIODOS-GET]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}

export const POST = async (
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
    const parseResult = createPeriodoSchemaServer.safeParse(body)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { periodo, instructor } = parseResult.data

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

    // CHECK IF INSTRUCTOR EXISTS
    if (instructor) {
      const instructorFound = await prismadb.instructor.findUnique({
        where: { id: instructor },
      })

      if (!instructorFound) {
        return NextResponse.json(
          { message: "Instructor not found" },
          { status: 404 },
        )
      }
    }

    // Check if PERIODO EXISTS
    const duplicatePeriodo = await prismadb.horarioPeriodo.findFirst({
      where: {
        horarioId: params.horarioId,
        periodo,
      },
    })

    if (duplicatePeriodo) {
      return NextResponse.json(
        { message: "Periodo already exists" },
        { status: 409 },
      )
    }

    // Create periodo
    const newPeriodo = await prismadb.horarioPeriodo.create({
      data: {
        horarioId: params.horarioId,
        periodo,
        instructorId: instructor,
      },
    })

    return NextResponse.json(newPeriodo)
  } catch (error) {
    console.log("[PERIODOS-POST]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
