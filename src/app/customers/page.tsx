import prismadb from "@/lib/prismadb"
import { CustomerColumn, columns } from "./_components/columns"
import { Heading } from "./_components/heading"
import { Modals } from "./_components/modals"
import { calcularEdad } from "@/utils"
import { DataTableSearch } from "@/components/ui/data-table-search"
import { PlanEstado } from "@prisma/client"

const Page = async ({
  searchParams,
}: {
  searchParams?: {
    horario?: string
  }
}) => {
  let horarioSp = searchParams?.horario

  if (horarioSp) {
    const horarioFound = await prismadb.horario.findUnique({
      where: {
        id: horarioSp,
      },
    })

    if (!horarioFound) {
      horarioSp = undefined
    }
  }

  const customersPlans = await prismadb.plan.findMany({
    where: {
      horarioId: horarioSp,
      estado: PlanEstado.VIGENTE,
    },
    orderBy: {
      cliente: {
        nombre_completo: "asc",
      },
    },
    include: {
      cliente: true,
    },
  })

  const formattedCustomers: CustomerColumn[] = customersPlans.map(
    (customerPlan) => ({
      id: customerPlan.id,
      nombre: customerPlan.cliente.nombre_completo,
      genero: customerPlan.cliente.genero,
      celular: customerPlan.cliente.celular,
      cedula: customerPlan.cliente.cedula,
      edad: customerPlan.cliente.fecha_nacimiento
        ? calcularEdad(customerPlan.cliente.fecha_nacimiento).toString()
        : "-",
      planEstado: customerPlan.estado,
    }),
  )

  const horarios = await prismadb.horario.findMany({
    orderBy: { hora_inicio: "asc" },
  })

  return (
    <main>
      <Heading
        customersLength={formattedCustomers.length}
        horarios={horarios}
      />
      <DataTableSearch columns={columns} data={formattedCustomers} />
      <Modals />
    </main>
  )
}

export default Page
