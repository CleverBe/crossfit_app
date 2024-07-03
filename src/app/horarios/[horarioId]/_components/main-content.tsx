"use client"

import { Horario } from "@prisma/client"
import { dayjsEs } from "@/lib/dayjs"
import { Heading } from "./heading"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./customers/columns"
import { useQuery } from "@tanstack/react-query"
import { getHorarioPlansFn } from "@/services/plan"
interface Props {
  horario: Horario
}

export const MainContent = ({ horario }: Props) => {
  const horarioId = horario.id

  const { data } = useQuery({
    queryKey: ["planes", { horarioId }],
    queryFn: () => getHorarioPlansFn({ horarioId }),
  })

  if (!data) return null

  const formattedPlanes = data.map((plan) => {
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
    <>
      <Heading horario={horario} />
      <DataTable columns={columns} data={formattedPlanes} />
    </>
  )
}
