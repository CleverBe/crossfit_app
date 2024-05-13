import prismadb from "@/lib/prismadb"
import { DescuentoColumn, columns } from "./_components/columns"
import { Heading } from "./_components/heading"
import { DataTable } from "@/components/ui/data-table"
import { Modals } from "./_components/modals"

const Page = async () => {
  const descuentos = await prismadb.descuento.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  const formattedDescuentos: DescuentoColumn[] = descuentos.map(
    (descuento) => ({
      id: descuento.id,
      titulo: descuento.titulo,
      porcentaje: `${descuento.porcentaje} %`,
    }),
  )

  return (
    <main>
      <Heading descuentosLength={formattedDescuentos.length} />
      <DataTable columns={columns} data={formattedDescuentos} />
      <Modals />
    </main>
  )
}

export default Page
