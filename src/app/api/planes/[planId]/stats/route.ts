import { getSessionServerSide } from "@/lib/getSession"
import prismadb from "@/lib/prismadb"
import { formatErrorsToResponse } from "@/lib/utils"
import { updatePlanStatsSchema } from "@/schemas/stats"
import { NextResponse } from "next/server"

export const PUT = async (
  req: Request,
  { params }: { params: { planId: string } },
) => {
  try {
    const session = await getSessionServerSide()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const parseResult = updatePlanStatsSchema.safeParse(body)

    if (!parseResult.success) {
      const errors = formatErrorsToResponse(parseResult.error.issues)

      return NextResponse.json({ errors }, { status: 400 })
    }

    const {
      back_squat,
      bench_press,
      burpees,
      clean,
      dead_lift,
      fourHundredMts,
      front_squat,
      plank,
      press_strit,
      push_press,
      pushups,
      sit_ups,
      snatch,
      squat,
      su,
      thuster,
      wall_sit,
    } = parseResult.data

    const planFound = await prismadb.plan.findUnique({
      where: { id: params.planId },
      include: {
        descuento: true,
        tipoDePlan: true,
      },
    })

    if (!planFound) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 })
    }

    const instructor = await prismadb.estadisticas.update({
      where: {
        id: planFound.estadisticasId,
      },
      data: {
        back_squat,
        bench_press,
        burpees,
        clean,
        dead_lift,
        front_squat,
        press_strit,
        push_press,
        pushups,
        sit_ups,
        snatch,
        squat,
        su,
        thuster,
        wall_sit:
          wall_sit && wall_sit.minutes && wall_sit.seconds
            ? `${wall_sit.minutes}:${wall_sit.seconds}`
            : "",
        plank:
          plank && plank.minutes && plank.seconds
            ? `${plank.minutes}:${plank.seconds}`
            : "",
        fourHundredMts:
          fourHundredMts && fourHundredMts.minutes && fourHundredMts.seconds
            ? `${fourHundredMts.minutes}:${fourHundredMts.seconds}`
            : "",
      },
    })

    return NextResponse.json(instructor)
  } catch (error) {
    console.log("[PLAN-PUT]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
