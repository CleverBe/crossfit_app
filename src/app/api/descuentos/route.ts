import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { formatErrorsToResponse } from "@/lib/utils"
import {
  createDescuentoSchemaServer,
  getDescuentosSearchParamsSchema,
} from "@/schemas/descuentos"
import { Prisma } from "@prisma/client"
import { getSessionServerSide } from "@/lib/getSession"

export const GET = async (req: Request) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)

    const estadoSearchParam = searchParams.get("estado")

    const validation = getDescuentosSearchParamsSchema.safeParse({
      estado: estadoSearchParam || undefined,
    })

    if (!validation.success) {
      const errors = formatErrorsToResponse(validation.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { estado } = validation.data

    const descuentos = await prismadb.descuento.findMany({
      where: {
        estado,
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(descuentos)
  } catch (error) {
    console.log("[DESCUENTOS-GET]", error)
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

    const parseResult = createDescuentoSchemaServer.safeParse(body)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { titulo, porcentaje } = parseResult.data

    const newDescuento = await prismadb.descuento.create({
      data: {
        titulo,
        porcentaje,
      },
    })

    return NextResponse.json(newDescuento)
  } catch (error) {
    console.log("[DESCUENTO-POST]", error)
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
