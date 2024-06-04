import { deleteImage, uploadImageBuffer } from "@/lib/cloudinary"
import prismadb from "@/lib/prismadb"
import { Prisma, Imagen } from "@prisma/client"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { updateUserSchemaServer } from "@/schemas/users"
import { formatErrorsToResponse } from "@/lib/utils"
import { getSessionServerSide } from "@/lib/getSession"

export const GET = async (
  req: Request,
  { params }: { params: { userId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await prismadb.usuario.findUnique({
      where: {
        id: params.userId,
      },
      include: {
        imagen: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const { password, ...userWithoutPassword } = user

    const formattedUser = {
      ...userWithoutPassword,
      imagen: user.imagen?.secureUrl,
    }

    return NextResponse.json(formattedUser)
  } catch (error) {
    console.log("[USER-GET]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()

    const form = Object.fromEntries(formData.entries())

    const parseResult = updateUserSchemaServer.safeParse(form)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { nombre, email, password, role, imagen } = parseResult.data

    const userFound = await prismadb.usuario.findUnique({
      where: { id: params.userId },
      include: { imagen: true },
    })

    if (!userFound) {
      return NextResponse.json({ messsage: "User not found" }, { status: 404 })
    }

    let hashedPassword: string | undefined = undefined

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    const user = await prismadb.usuario.update({
      where: {
        id: params.userId,
      },
      data: {
        nombre,
        email,
        role,
        password: hashedPassword ? hashedPassword : undefined,
      },
    })

    let userImage: undefined | Imagen = undefined

    if (imagen) {
      const bytes = await imagen.arrayBuffer()
      const buffer = Buffer.from(bytes)
      // save new image
      const responseCloud = await uploadImageBuffer({
        buffer,
        folder: "Users",
      })
      if (responseCloud) {
        const userImageId = userFound.imagen?.id
        const userImagePublicId = userFound.imagen?.publicId
        if (userImageId && userImagePublicId) {
          // delete image from database
          await prismadb.imagen.delete({
            where: { id: userImageId },
          })
          // delete image from cloudinary
          await deleteImage(userImagePublicId)
        }

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
    console.log("[USER-PATCH]", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // @ts-ignore
        if (error.meta?.target?.[0] === "email") {
          return NextResponse.json(
            { message: "That email is already taken" },
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
  { params }: { params: { userId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userFound = await prismadb.usuario.findUnique({
      where: { id: params.userId },
    })

    if (!userFound) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const user = await prismadb.usuario.delete({
      where: {
        id: params.userId,
      },
      include: { imagen: true },
    })

    if (user.imagen?.publicId) {
      await deleteImage(user.imagen.publicId)
    }

    return NextResponse.json({})
  } catch (error) {
    console.log("[USER-DELETE]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
