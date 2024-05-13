import prismadb from "@/lib/prismadb"
import { notFound } from "next/navigation"
import { Heading } from "./_components/heading"
import { Estado } from "@prisma/client"
import { Modals } from "./_components/modals"

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
    include: {
      horarioPeriodos: {
        include: {
          instructor: true,
        },
        orderBy: {
          periodo: "desc",
        },
      },
    },
  })

  const instructores = await prismadb.instructor.findMany({
    where: {
      estado: Estado.ACTIVO,
    },
  })

  if (!horario) {
    notFound()
  }

  return (
    <main>
      <Heading horario={horario} instructores={instructores} />
      <Modals />
    </main>
  )
}

export default Page
