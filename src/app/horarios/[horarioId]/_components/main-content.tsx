"use client"

import { Instructor } from "@prisma/client"
import { PlanColumn, columns } from "./customers/columns"
import { HorarioWithPeriodos } from "@/types"
import { Heading } from "./heading"
import { DataTable } from "@/components/ui/data-table"
import { useState } from "react"

interface Props {
  horario: HorarioWithPeriodos
  instructores: Instructor[]
  customers: PlanColumn[]
}

export const MainContent = ({ horario, instructores, customers }: Props) => {
  const [periodoFiltro, setPeriodoFiltro] = useState<string | null>(() => {
    return horario.horarioPeriodos.length > 0
      ? horario.horarioPeriodos[0].periodo
      : null
  })

  const changePeriodoFiltro = (newValue: string | null) => {
    setPeriodoFiltro(newValue)
  }

  return (
    <>
      <Heading
        horario={horario}
        instructores={instructores}
        periodoFiltro={periodoFiltro}
        changePeriodoFiltro={changePeriodoFiltro}
      />
      <DataTable columns={columns} data={customers} />
    </>
  )
}
