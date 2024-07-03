"use client"
import { Horario } from "@prisma/client"

interface Props {
  horario: Horario
}

export const Heading = ({ horario }: Props) => {
  return (
    <>
      <div className="p-5">
        <h1 className="text-xl">
          Horario: {horario.hora_inicio} - {horario.hora_fin}
        </h1>
        <p>Turno : {horario.turno === "MANANA" ? "MAÑANA" : horario.turno}</p>
        <p>Estado del horario: {horario.estado}</p>
      </div>
    </>
  )
}
