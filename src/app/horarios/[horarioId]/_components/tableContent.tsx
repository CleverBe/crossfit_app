import { DataTable } from "@/components/ui/data-table"
import { usePlans } from "../_hooks/usePlans"
import { columns } from "./customers/columns"
import { dayjsEs } from "@/lib/dayjs"

export const TableContent = ({
  periodoHorarioId,
}: {
  periodoHorarioId: string
}) => {
  const { data } = usePlans(periodoHorarioId)

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
      <DataTable columns={columns} data={formattedPlanes} />
    </>
  )
}
