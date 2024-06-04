import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { formatErrorsToResponse } from "@/lib/utils"
import { updateDescuentoSchemaServer } from "@/schemas/descuentos"
import { Prisma } from "@prisma/client"
import { getSessionServerSide } from "@/lib/getSession"

export const GET = async (
  req: Request,
  { params }: { params: { descuentoId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const descuento = await prismadb.descuento.findUnique({
      where: {
        id: params.descuentoId,
      },
    })

    if (!descuento) {
      return NextResponse.json(
        { message: "Descuento not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(descuento)
  } catch (error) {
    console.log("[DESCUENTO-GET]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}

export const PATCH = async (
  req: Request,
  { params }: { params: { descuentoId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const parseResult = updateDescuentoSchemaServer.safeParse(body)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { titulo, porcentaje, estado } = parseResult.data

    const descuentoFound = await prismadb.descuento.findUnique({
      where: { id: params.descuentoId },
    })

    if (!descuentoFound) {
      return NextResponse.json(
        { messsage: "Descuento not found" },
        { status: 404 },
      )
    }

    const updatedDescuento = await prismadb.descuento.update({
      where: {
        id: params.descuentoId,
      },
      data: {
        titulo,
        porcentaje,
        estado,
      },
    })

    return NextResponse.json(updatedDescuento)
  } catch (error) {
    console.log("[DESCUENTO-PATCH]", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // @ts-ignore
        if (error.meta?.target?.includes("titulo")) {
          return NextResponse.json(
            { message: "No puede haber dos descuentos con el mismo nombre" },
            {
              status: 400,
            },
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
  { params }: { params: { descuentoId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const descuentoFound = await prismadb.descuento.findUnique({
      where: { id: params.descuentoId },
    })

    if (!descuentoFound) {
      return NextResponse.json(
        { message: "Descuento not found" },
        { status: 404 },
      )
    }

    await prismadb.descuento.delete({
      where: {
        id: params.descuentoId,
      },
    })

    return NextResponse.json({})
  } catch (error) {
    console.log("[DESCUENTO-DELETE]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
