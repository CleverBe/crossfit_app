import prismadb from "@/lib/prismadb"
import { Prisma, Imagen } from "@prisma/client"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { uploadImageBuffer } from "@/lib/cloudinary"
import { createUserSchemaServer } from "@/schemas/users"
import { formatErrorsToResponse } from "@/lib/utils"
import { getSessionServerSide } from "@/lib/getSession"

export const GET = async (req: Request) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const users = await prismadb.usuario.findMany({
      include: {
        imagen: true,
      },
      orderBy: { createdAt: "asc" },
    })

    const formattedUsers = users.map((user) => {
      const { password, ...otherProps } = user

      return { ...otherProps, image: user.imagen?.secureUrl }
    })

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.log("[USERS-GET]", error)
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

    const formData = await req.formData()

    const form = Object.fromEntries(formData.entries())

    const parseResult = createUserSchemaServer.safeParse(form)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { nombre, email, password, role, imagen } = parseResult.data

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prismadb.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        role,
      },
    })

    let userImage: undefined | Imagen = undefined

    if (imagen) {
      const bytes = await imagen.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const responseCloud = await uploadImageBuffer({
        buffer,
        folder: "Users",
      })
      if (responseCloud) {
        userImage = await prismadb.imagen.create({
          data: {
            publicId: responseCloud.public_id,
            secureUrl: responseCloud.secure_url,
            userId: user.id,
          },
        })
      }
    }

    const { password: omited, ...userWithoutPassword } = user

    const formattedUser = {
      ...userWithoutPassword,
      image: userImage ? userImage.secureUrl : undefined,
    }

    return NextResponse.json(formattedUser)
  } catch (error) {
    console.log("[USERS-POST]", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // @ts-ignore
        if (error.meta?.target?.includes("email")) {
          return NextResponse.json(
            { message: "Ya existe un usuario con este correo" },
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
