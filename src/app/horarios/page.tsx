import prismadb from "@/lib/prismadb"
import { HorarioColumn, columns } from "./_components/columns"
import { Heading } from "./_components/heading"
import { DataTable } from "@/components/ui/data-table"
import { Modals } from "./_components/modals"

const Page = async () => {
  const horarios = await prismadb.horario.findMany({
    orderBy: {
      hora_inicio: "asc",
    },
  })

  const formattedHorarios: HorarioColumn[] = horarios.map((horario) => ({
    id: horario.id,
    hora_inicio: horario.hora_inicio,
    hora_fin: horario.hora_fin,
    turno: horario.turno === "MANANA" ? "MAÑANA" : horario.turno,
    estado: horario.estado,
  }))

  return (
    <main>
      <Heading horariosLength={formattedHorarios.length} />
      <DataTable columns={columns} data={formattedHorarios} />
      <Modals />
    </main>
  )
}

export default Page
