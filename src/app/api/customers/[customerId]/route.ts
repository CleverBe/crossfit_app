import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { formatErrorsToResponse } from "@/lib/utils"
import { Prisma } from "@prisma/client"
import { updateCustomerSchemaServer } from "@/schemas/customer"
import { getSessionServerSide } from "@/lib/getSession"

export const GET = async (
  req: Request,
  { params }: { params: { customerId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const customer = await prismadb.cliente.findUnique({
      where: {
        id: params.customerId,
      },
    })

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.log("[CUSTOMER-GET]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}

export const PATCH = async (
  req: Request,
  { params }: { params: { customerId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const parseResult = updateCustomerSchemaServer.safeParse(body)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const {
      nombre_completo,
      genero,
      cedula,
      celular,
      fecha_nacimiento,
      estatura,
      peso_cliente,
    } = parseResult.data

    const customerFound = await prismadb.cliente.findUnique({
      where: { id: params.customerId },
    })

    if (!customerFound) {
      return NextResponse.json(
        { messsage: "Customer not found" },
        { status: 404 },
      )
    }

    const updatedCustomer = await prismadb.cliente.update({
      where: {
        id: params.customerId,
      },
      data: {
        nombre_completo,
        genero,
        cedula,
        celular,
        fecha_nacimiento,
        estatura,
        peso: peso_cliente,
      },
    })

    return NextResponse.json(updatedCustomer)
  } catch (error) {
    console.log("[CUSTOMER-PATCH]", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // @ts-ignore
        if (error.meta?.target?.includes("cedula")) {
          return NextResponse.json(
            { message: "Ya existe un cliente con esta cédula" },
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
  { params }: { params: { customerId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const customerFound = await prismadb.cliente.findUnique({
      where: { id: params.customerId },
    })

    if (!customerFound) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      )
    }

    await prismadb.cliente.delete({
      where: {
        id: params.customerId,
      },
    })

    return NextResponse.json({})
  } catch (error) {
    console.log("[CUSTOMER-DELETE]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
