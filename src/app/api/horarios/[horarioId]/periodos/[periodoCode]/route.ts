import prismadb from "@/lib/prismadb"
import { formatErrorsToResponse } from "@/lib/utils"
import { assignInstructorToPeriodoSchema } from "@/schemas/periodos"
import { NextResponse } from "next/server"

export const GET = async (
  req: Request,
  { params }: { params: { horarioId: string; periodoCode: string } },
) => {
  try {
    // TODO: VALIDAR PARAMETROS

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

    return NextResponse.json(periodo)
  } catch (error) {
    console.log("[PERIODOS-GET]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}

export const PATCH = async (
  req: Request,
  { params }: { params: { horarioId: string; periodoCode: string } },
) => {
  const body = await req.json()

  // Validate body
  const parseResult = assignInstructorToPeriodoSchema.safeParse(body)

  if (!parseResult.success) {
    const errors = formatErrorsToResponse(parseResult.error.issues)

    return NextResponse.json({ errors }, { status: 400 })
  }

  const { instructorId } = parseResult.data

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

    if (instructorId === "unassigned") {
      const updatedPeriodo = await prismadb.horarioPeriodo.update({
        where: {
          id: periodo.id,
        },
        data: {
          instructorId: null,
        },
      })

      return NextResponse.json(updatedPeriodo)
    }

    const instructorFound = await prismadb.instructor.findUnique({
      where: { id: instructorId },
    })

    if (!instructorFound) {
      return NextResponse.json(
        { message: "Instructor not found" },
        { status: 404 },
      )
    }

    // TODO: VALIDATE IF INSTRUCTOR IS ASSIGNED TO ANOTHER PERIODO

    const updatedPeriodo = await prismadb.horarioPeriodo.update({
      where: {
        id: periodo.id,
      },
      data: {
        instructorId,
      },
    })

    return NextResponse.json(updatedPeriodo)
  } catch (error) {
    console.log("[PERIODOS-PATCH]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
