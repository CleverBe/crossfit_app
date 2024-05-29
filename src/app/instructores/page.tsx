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
    (instructor) => ({
      id: instructor.id,
      name: instructor.nombre + " " + instructor.apellido,
      email: instructor.email,
      genero: instructor.genero,
      celular: instructor.celular,
      estado: instructor.estado,
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
