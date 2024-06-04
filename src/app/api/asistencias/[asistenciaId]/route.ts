import { getSessionServerSide } from "@/lib/getSession"
import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"

export const DELETE = async (
  req: Request,
  { params }: { params: { asistenciaId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const asistenciaFound = await prismadb.asistencias.findUnique({
      where: { id: params.asistenciaId },
    })

    if (!asistenciaFound) {
      return NextResponse.json(
        { message: "Asistencia not found" },
        { status: 404 },
      )
    }

    await prismadb.asistencias.delete({
      where: {
        id: params.asistenciaId,
      },
    })

    return NextResponse.json({})
  } catch (error) {
    console.log("[ASISTENCIA-DELETE]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
