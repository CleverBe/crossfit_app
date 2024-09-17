import { getSessionServerSide } from "@/lib/getSession"
import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"

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

    const customerPlans = await prismadb.plan.findMany({
      where: {
        clienteId: customer.id,
      },
      include: {
        asistencias: true,
        instructor: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    if (!customerPlans) {
      return NextResponse.json(
        { message: "Customer plans not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({
      id: customer.id,
      nombre_completo: customer.nombre_completo,
      genero: customer.genero,
      celular: customer.celular,
      cedula: customer.cedula,
      fecha_nacimiento: customer.fecha_nacimiento,
      planes: customerPlans,
    })
  } catch (error) {
    console.log("[CUSTOMER-PLANS-GET]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
