import prismadb from "@/lib/prismadb"
import { notFound } from "next/navigation"
import { Estado } from "@prisma/client"
import { MainContent } from "./_components/main-content"

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

  const instructores = await prismadb.instructor.findMany({
    where: {
      estado: Estado.ACTIVO,
    },
  })

  if (!horario) {
    notFound()
  }

  const horarioPeriodos = await prismadb.horarioPeriodo.findMany({
    where: {
      horarioId: horario.id,
    },
    orderBy: {
      periodo: "desc",
    },
  })

  return (
    <main>
      <MainContent
        horario={horario}
        instructores={instructores}
        horarioPeriodos={horarioPeriodos}
      />
    </main>
  )
}

export default Page
