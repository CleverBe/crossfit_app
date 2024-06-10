import prismadb from "@/lib/prismadb"
import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { formatErrorsToResponse } from "@/lib/utils"
import {
  createInstructorSchemaServer,
  getInstructoresSearchParamsSchema,
} from "@/schemas/instructores"
import { getSessionServerSide } from "@/lib/getSession"

export const GET = async (req: Request) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)

    const estadoSearchParam = searchParams.get("estado")

    const validation = getInstructoresSearchParamsSchema.safeParse({
      estado: estadoSearchParam || undefined,
    })

    if (!validation.success) {
      const errors = formatErrorsToResponse(validation.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { estado } = validation.data

    const instructores = await prismadb.instructor.findMany({
      where: {
        estado,
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(instructores)
  } catch (error) {
    console.log("[INSTRUCTORES-GET]", error)
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

    const parseResult = createInstructorSchemaServer.safeParse(body)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { nombre, apellido, celular, email, genero } = parseResult.data

    const instructor = await prismadb.instructor.create({
      data: {
        nombre,
        apellido,
        celular,
        genero,
        email,
      },
    })

    return NextResponse.json(instructor)
  } catch (error) {
    console.log("[INSTRUCTORES-POST]", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // @ts-ignore
        if (error.meta?.target?.includes("email")) {
          return NextResponse.json(
            { message: "Ya existe un instructor con este email" },
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
