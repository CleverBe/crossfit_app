import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import prismadb from "@/lib/prismadb"
import { formatErrorsToResponse } from "@/lib/utils"
import { registerUserSchemaServer } from "@/schemas/auth"

export const POST = async (req: Request) => {
  try {
    const data = await req.json()

    const parseResult = registerUserSchemaServer.safeParse(data)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const { email, name, password } = parseResult.data

    const duplicateEmail = await prismadb.usuario.findUnique({
      where: {
        email,
      },
    })

    if (duplicateEmail) {
      return NextResponse.json(
        { message: "Ya existe un usuario con este email" },
        { status: 400 },
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prismadb.usuario.create({
      data: {
        nombre: name,
        email: email,
        password: hashedPassword,
      },
    })

    const { password: passwordUser, ...user } = newUser

    return NextResponse.json(user)
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    )
  }
}
