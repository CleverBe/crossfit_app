import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { formatErrorsToResponse } from "@/lib/utils"
import { updateTipoDePlanSchemaServer } from "@/schemas/tipoDePlanes"
import { getSessionServerSide } from "@/lib/getSession"
import { Prisma } from "@prisma/client"

export const GET = async (
  req: Request,
  { params }: { params: { tipoDePlanId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const tipoDePlan = await prismadb.tipoDePlan.findUnique({
      where: {
        id: params.tipoDePlanId,
      },
    })

    if (!tipoDePlan) {
      return NextResponse.json(
        { message: "TipoDePlan not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(tipoDePlan)
  } catch (error) {
    console.log("[TIPODEPLAN-GET]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}

export const PATCH = async (
  req: Request,
  { params }: { params: { tipoDePlanId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const parseResult = updateTipoDePlanSchemaServer.safeParse(body)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { tipo, dias, costo, cantidadDeClases } = parseResult.data

    const tipoDePlanFound = await prismadb.tipoDePlan.findUnique({
      where: { id: params.tipoDePlanId },
    })

    if (!tipoDePlanFound) {
      return NextResponse.json(
        { messsage: "tipoDePlan not found" },
        { status: 404 },
      )
    }

    const updatedTipoDePlan = await prismadb.tipoDePlan.update({
      where: {
        id: params.tipoDePlanId,
      },
      data: {
        tipo,
        dias,
        costo,
        cantidadDeClases,
      },
    })

    return NextResponse.json(updatedTipoDePlan)
  } catch (error) {
    console.log("[TIPODEPLAN-PATCH]", error)
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

export const DELETE = async (
  req: Request,
  { params }: { params: { tipoDePlanId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const tipoDePlanFound = await prismadb.tipoDePlan.findUnique({
      where: { id: params.tipoDePlanId },
    })

    if (!tipoDePlanFound) {
      return NextResponse.json(
        { message: "TipoDePlan not found" },
        { status: 404 },
      )
    }

    await prismadb.tipoDePlan.delete({
      where: {
        id: params.tipoDePlanId,
      },
    })

    return NextResponse.json({})
  } catch (error) {
    console.log("[TIPODEPLAN-DELETE]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
