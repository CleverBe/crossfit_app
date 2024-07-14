import prismadb from "@/lib/prismadb"
import { CustomerPlanColumn, columns } from "./_components/columns"
import { Heading } from "./_components/heading"
import { Modals } from "./_components/modals"
import { calcularEdad } from "@/utils"
import { DataTableSearch } from "@/components/ui/data-table-search"
import { PlanEstado } from "@prisma/client"
import { z } from "zod"
import { dayjsEs } from "@/lib/dayjs"

const Page = async ({
  searchParams,
}: {
  searchParams?: {
    horario?: string
    estado?: string
  }
}) => {
  let horarioSp = searchParams?.horario
  let estadoSp = searchParams?.estado

  const validateParams = z.object({
    estadoSp: z.nativeEnum(PlanEstado),
  })

  const validation = validateParams.safeParse({ estadoSp })

  if (!validation.success) {
    estadoSp = PlanEstado.VIGENTE
  }

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
      estado: estadoSp as PlanEstado,
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

  const formattedCustomers: CustomerPlanColumn[] = customersPlans.map(
    (customerPlan) => ({
      planId: customerPlan.id,
      clienteId: customerPlan.cliente.id,
      nombre: customerPlan.cliente.nombre_completo,
      genero: customerPlan.cliente.genero,
      celular: customerPlan.cliente.celular,
      cedula: customerPlan.cliente.cedula,
      edad: customerPlan.cliente.fecha_nacimiento
        ? calcularEdad(customerPlan.cliente.fecha_nacimiento).toString()
        : "-",
      fecha_inicio: dayjsEs(customerPlan.fecha_inicio).format("DD/MM/YYYY"),
      fecha_fin: dayjsEs(customerPlan.fecha_fin).format("DD/MM/YYYY"),
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
