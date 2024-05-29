import prismadb from "@/lib/prismadb"
import { notFound } from "next/navigation"
import { Estado } from "@prisma/client"
import { MainContent } from "./_components/main-content"
import { dayjsEs } from "@/lib/dayjs"

interface Props {
  params: {
    horarioId: string
  }
}

const Page = async ({ params }: Props) => {
  const horario = await prismadb.horario.findUnique({
    where: {
      id: params.horarioId,
    },
    include: {
      horarioPeriodos: {
        include: {
          instructor: true,
        },
        orderBy: {
          periodo: "desc",
        },
      },
    },
  })

  const instructores = await prismadb.instructor.findMany({
    where: {
      estado: Estado.ACTIVO,
    },
  })

  if (!horario) {
    notFound()
  }

  const planes = await prismadb.plan.findMany({
    where: {
      horarioPeriodoId: horario.horarioPeriodos[0]?.id ?? "", // TODO: Fix this
    },
    include: {
      tipoDePlan: true,
      cliente: true,
    },
  })

  const formattedPlanes = planes.map((plan) => {
    return {
      id: plan.id,
      customerId: plan.cliente.id,
      nombre: plan.cliente.nombre_completo,
      celular: plan.cliente.celular,
      cedula: plan.cliente.cedula,
      tipoDePlan: plan.tipoDePlan.tipo,
      fecha_inscripcion: dayjsEs(plan.fecha_inscripcion).format(
        "DD/MM/YYYY HH:mm",
      ),
      fecha_inicio: dayjsEs(plan.fecha_inicio).format("DD/MM/YYYY"),
      fecha_fin: dayjsEs(plan.fecha_fin).format("DD/MM/YYYY"),
    }
  })

  return (
    <main>
      <MainContent
        horario={horario}
        instructores={instructores}
        customers={formattedPlanes}
      />
    </main>
  )
}

export default Page
