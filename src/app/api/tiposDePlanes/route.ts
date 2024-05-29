import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { formatErrorsToResponse } from "@/lib/utils"
import { createTipoDePlanSchemaServer } from "@/schemas/tipoDePlanes"

export const GET = async (req: Request) => {
  try {
    const tiposDePlanes = await prismadb.tipoDePlan.findMany({
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(tiposDePlanes)
  } catch (error) {
    console.log("[TIPOSDEPLANES-GET]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}

export const POST = async (req: Request) => {
  try {
    const body = await req.json()

    const parseResult = createTipoDePlanSchemaServer.safeParse(body)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { tipo, dias, costo, cantidadDeClases } = parseResult.data

    const newTipoDePlan = await prismadb.tipoDePlan.create({
      data: {
        tipo,
        costo,
        cantidadDeClases,
        dias,
      },
    })

    return NextResponse.json(newTipoDePlan)
  } catch (error) {
    console.log("[TIPODEPLAN-POST]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
