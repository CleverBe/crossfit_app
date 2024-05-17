import prismadb from "@/lib/prismadb"
import { TipoDePlanColumn, columns } from "./_components/columns"
import { Heading } from "./_components/heading"
import { DataTable } from "@/components/ui/data-table"
import { Modals } from "./_components/modals"
import { sortDays } from "@/utils"

const Page = async () => {
  const tipoDePlanes = await prismadb.tipoDePlan.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  const formattedTipoDePlanes: TipoDePlanColumn[] = tipoDePlanes.map(
    (tipoDePlan) => ({
      id: tipoDePlan.id,
      tipo: tipoDePlan.tipo,
      dias: sortDays(tipoDePlan.dias).join(", "),
      costo: `${tipoDePlan.costo}`,
    }),
  )

  return (
    <main>
      <Heading tipoDePlanesLength={formattedTipoDePlanes.length} />
      <DataTable columns={columns} data={formattedTipoDePlanes} />
      <Modals />
    </main>
  )
}

export default Page
