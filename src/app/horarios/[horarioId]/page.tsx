import prismadb from "@/lib/prismadb"
import { notFound } from "next/navigation"
import { MainContent } from "./_components/main-content"
import { Modals } from "./_components/customers/modals"

interface Props {
  params: {
    horarioId: string
  }
}

const Page = async ({ params }: Props) => {
  const horario = await prismadb.horario.findUnique({
    where: {
      id: params.horarioId,
    },
  })

  if (!horario) {
    notFound()
  }

  return (
    <main>
      <MainContent horario={horario} />
      <Modals />
    </main>
  )
}

export default Page
