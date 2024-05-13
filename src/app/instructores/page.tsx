import prismadb from "@/lib/prismadb"
import { InstructorColumn, columns } from "./_components/columns"
import { Heading } from "./_components/heading"
import { DataTable } from "@/components/ui/data-table"
import { Modals } from "./_components/modals"

const Page = async () => {
  const instructores = await prismadb.instructor.findMany({
    orderBy: {
      createdAt: "asc",
    },
  })

  const formattedInstructores: InstructorColumn[] = instructores.map(
    (user) => ({
      id: user.id,
      name: user.nombre + " " + user.apellido,
      email: user.email,
      genero: user.genero,
      celular: user.celular,
    }),
  )

  return (
    <main>
      <Heading instructoresLength={formattedInstructores.length} />
      <DataTable columns={columns} data={formattedInstructores} />
      <Modals />
    </main>
  )
}

export default Page
