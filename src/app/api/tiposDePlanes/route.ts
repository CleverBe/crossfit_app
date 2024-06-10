import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { formatErrorsToResponse } from "@/lib/utils"
import { createTipoDePlanSchemaServer } from "@/schemas/tipoDePlanes"
import { getSessionServerSide } from "@/lib/getSession"
import { Prisma } from "@prisma/client"

export const GET = async (req: Request) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

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
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // @ts-ignore
        if (error.meta?.target?.includes("tipo")) {
          return NextResponse.json(
            { message: "El tipo de plan ya existe" },
            { status: 400 },
          )
        }
      }
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
