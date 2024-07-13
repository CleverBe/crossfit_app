import prismadb from "@/lib/prismadb"
import { CustomerColumn, columns } from "./_components/columns"
import { Heading } from "./_components/heading"
import { Modals } from "./_components/modals"
import { calcularEdad } from "@/utils"
import { DataTableSearch } from "@/components/ui/data-table-search"

const Page = async () => {
  const customers = await prismadb.cliente.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  const formattedCustomers: CustomerColumn[] = customers.map((customer) => ({
    id: customer.id,
    nombre: customer.nombre_completo,
    genero: customer.genero,
    celular: customer.celular,
    cedula: customer.cedula,
    edad: customer.fecha_nacimiento
      ? calcularEdad(customer.fecha_nacimiento).toString()
      : "-",
  }))

  return (
    <main>
      <Heading customersLength={formattedCustomers.length} />
      <DataTableSearch columns={columns} data={formattedCustomers} />
      <Modals />
    </main>
  )
}

export default Page
