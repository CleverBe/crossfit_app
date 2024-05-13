import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { formatErrorsToResponse } from "@/lib/utils"
import { updateTipoDePlanSchemaServer } from "@/schemas/tipoDePlanes"

export const GET = async (
  req: Request,
  { params }: { params: { tipoDePlanId: string } },
) => {
  try {
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
    const body = await req.json()

    const parseResult = updateTipoDePlanSchemaServer.safeParse(body)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { tipo, dias, costo } = parseResult.data

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
      },
    })

    return NextResponse.json(updatedTipoDePlan)
  } catch (error) {
    console.log("[TIPODEPLAN-PATCH]", error)
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
