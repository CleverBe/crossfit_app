import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"

export const GET = async (req: Request) => {
  try {
    const planes = await prismadb.plan.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        cliente: true,
        descuento: true,
        tipoDePlan: true,
        pago: true,
      },
    })

    return NextResponse.json(planes)
  } catch (error) {
    console.log("[PLANES-GET]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
