import prismadb from "@/lib/prismadb"
import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { formatErrorsToResponse } from "@/lib/utils"
import {
  createInstructorSchemaServer,
  getInstructoresSearchParamsSchema,
} from "@/schemas/instructores"

export const GET = async (req: Request) => {
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

  try {
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
        if (error.meta?.target?.[0] === "email") {
          return NextResponse.json(
            { message: "Email must be unique" },
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
