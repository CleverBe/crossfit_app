import { getSessionServerSide } from "@/lib/getSession"
import prismadb from "@/lib/prismadb"
import { formatErrorsToResponse } from "@/lib/utils"
import {
  assignInstructorToPeriodoSchema,
  validatePeriodoStringSchema,
} from "@/schemas/periodos"
import { NextResponse } from "next/server"

export const GET = async (
  req: Request,
  { params }: { params: { horarioId: string; periodoCode: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if horario exists
    const horarioFound = await prismadb.horario.findUnique({
      where: { id: params.horarioId },
      include: {
        horarioPeriodos: true,
      },
    })

    if (!horarioFound) {
      return NextResponse.json(
        { message: "Horario not found" },
        { status: 404 },
      )
    }

    // Validate if periodoCode param satisfies format 2020-01
    const validatePeriodoString = validatePeriodoStringSchema.safeParse(
      params.periodoCode,
    )

    if (!validatePeriodoString.success) {
      const errors = formatErrorsToResponse(validatePeriodoString.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    // Check if periodo exists
    const periodo = await prismadb.horarioPeriodo.findUnique({
      where: {
        periodo_horarioId: {
          periodo: params.periodoCode,
          horarioId: horarioFound.id,
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
  const session = await getSessionServerSide()

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

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
