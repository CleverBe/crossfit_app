"use client"

import { Horario, HorarioPeriodo, Instructor } from "@prisma/client"
import { Heading } from "./heading"
import { useState } from "react"
import { TableContent } from "./tableContent"

interface Props {
  horario: Horario
  instructores: Instructor[]
  horarioPeriodos: HorarioPeriodo[]
}

export const MainContent = ({
  horarioPeriodos,
  horario,
  instructores,
}: Props) => {
  const [periodoFilter, setPeriodoFilter] = useState<string>(() => {
    return horarioPeriodos.length > 0
      ? horarioPeriodos[0].periodo
      : "unassigned"
  })

  const currentHorarioPeriodo =
    horarioPeriodos.length > 0
      ? horarioPeriodos.find(
          (horarioPeriodo) => horarioPeriodo.periodo === periodoFilter,
        )
      : undefined

  const handlePeriodoFilter = (periodo: string) => {
    setPeriodoFilter(periodo)
  }

  return (
    <>
      <Heading
        horario={horario}
        instructores={instructores}
        horarioPeriodos={horarioPeriodos}
        currentHorarioPeriodo={currentHorarioPeriodo}
        handlePeriodoFilter={handlePeriodoFilter}
      />
      {currentHorarioPeriodo?.id && (
        <TableContent periodoHorarioId={currentHorarioPeriodo.id} />
      )}
    </>
  )
}
