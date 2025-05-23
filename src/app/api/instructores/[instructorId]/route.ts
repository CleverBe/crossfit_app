import prismadb from "@/lib/prismadb"
import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { formatErrorsToResponse } from "@/lib/utils"
import { updateInstructorSchemaServer } from "@/schemas/instructores"
import { getSessionServerSide } from "@/lib/getSession"

export const GET = async (
  req: Request,
  { params }: { params: { instructorId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const instructor = await prismadb.instructor.findUnique({
      where: {
        id: params.instructorId,
      },
    })

    if (!instructor) {
      return NextResponse.json(
        { message: "Instructor not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(instructor)
  } catch (error) {
    console.log("[INSTRUCTOR-GET]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}

export const PATCH = async (
  req: Request,
  { params }: { params: { instructorId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const parseResult = updateInstructorSchemaServer.safeParse(body)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { nombre, apellido, celular, email, genero, estado } =
      parseResult.data

    const instructorFound = await prismadb.instructor.findUnique({
      where: { id: params.instructorId },
    })

    if (!instructorFound) {
      return NextResponse.json(
        { messsage: "Instructor not found" },
        { status: 404 },
      )
    }

    const instructor = await prismadb.instructor.update({
      where: {
        id: params.instructorId,
      },
      data: {
        nombre,
        apellido,
        email,
        celular,
        genero,
        estado,
      },
    })

    return NextResponse.json(instructor)
  } catch (error) {
    console.log("[INSTRUCTOR-PATCH]", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // @ts-ignore
        if (error.meta?.target?.includes("email")) {
          return NextResponse.json(
            { message: "Ya existe un instructor con este email" },
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
  { params }: { params: { instructorId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const instructorFound = await prismadb.instructor.findUnique({
      where: { id: params.instructorId },
    })

    if (!instructorFound) {
      return NextResponse.json(
        { message: "Instructor not found" },
        { status: 404 },
      )
    }

    await prismadb.instructor.delete({
      where: {
        id: params.instructorId,
      },
    })

    return NextResponse.json({})
  } catch (error) {
    console.log("[INSTRUCTOR-DELETE]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
