import { getSessionServerSide } from "@/lib/getSession"
import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"

export const GET = async (
  req: Request,
  { params }: { params: { horarioPeriodoId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const planes = await prismadb.plan.findMany({
      where: {
        horarioPeriodoId: params.horarioPeriodoId,
      },
      orderBy: { createdAt: "desc" },
      include: {
        cliente: true,
        tipoDePlan: true,
      },
    })

    return NextResponse.json(planes)
  } catch (error) {
    console.log("[HORARIOS_PERIODOS_PLAN-GET]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
