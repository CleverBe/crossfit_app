import { DataTable } from "@/components/ui/data-table"
import { UserColumn, columns } from "./_components/columns"
import prismadb from "@/lib/prismadb"
import { Heading } from "./_components/heading"
import { Modals } from "./_components/modals"

const Page = async () => {
  const users = await prismadb.usuario.findMany({
    include: {
      imagen: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  const formattedUsers: UserColumn[] = users.map((user) => ({
    id: user.id,
    name: user.nombre,
    email: user.email,
    role: user.role,
    image: user.imagen?.secureUrl,
  }))

  return (
    <main>
      <Heading usersLength={formattedUsers.length} />
      <DataTable columns={columns} data={formattedUsers} />
      <Modals />
    </main>
  )
}

export default Page
