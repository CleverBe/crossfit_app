import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"

export const GET = async (req: Request) => {
  try {
    const customers = await prismadb.cliente.findMany({
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.log("[CUSTOMERS-GET]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
