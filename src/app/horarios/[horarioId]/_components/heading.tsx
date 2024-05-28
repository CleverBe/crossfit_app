"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HorarioWithPeriodos } from "@/types"
import { Instructor } from "@prisma/client"
import { useHorarioPeriodoModalCreate } from "../_hooks/useHorarioPeriodoModal"
import { ModalCreatePeriodo } from "./modal-create-periodo"
import { useMutation } from "@tanstack/react-query"
import { assignInstructoToPeriodoFn } from "@/services/periodos"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { handleGeneralErrors } from "@/lib/utils"
import { useCustomerModalCreate } from "../_hooks/useCustomerModal"
import { Modals } from "./customers/modals"

interface Props {
  horario: HorarioWithPeriodos
  instructores: Instructor[]
  periodoFiltro: string | null
  changePeriodoFiltro: (newValue: string | null) => void
}

export const Heading = ({
  horario,
  instructores,
  periodoFiltro,
  changePeriodoFiltro,
}: Props) => {
  const router = useRouter()

  const modalCreateCustomer = useCustomerModalCreate()

  const modalCreate = useHorarioPeriodoModalCreate()

  const currentPeriodo = horario.horarioPeriodos.find(
    (periodo) => periodo.periodo === periodoFiltro,
  )

  const { mutate, isPending } = useMutation({
    mutationFn: assignInstructoToPeriodoFn,
  })

  const onAssignInstructorToPeriodo = async (instructorId: string) => {
    if (!currentPeriodo) return

    mutate(
      {
        instructorId,
        horarioId: horario.id,
        periodoCode: currentPeriodo?.periodo,
      },
      {
        onSuccess: () => {
          router.refresh()
          toast.success(`Asignado correctamente`)
        },
        onError: (err: unknown) => {
          const errorMessage = handleGeneralErrors(err)

          if (Array.isArray(errorMessage)) {
            errorMessage.forEach((error) => {
              toast.error(error.message)
            })
          } else {
            toast.error(errorMessage)
          }
        },
      },
    )
  }

  return (
    <>
      <div className="p-5">
        <h1 className="text-xl">
          Horario: {horario.hora_inicio} - {horario.hora_fin}
        </h1>
        <p>Turno : {horario.turno === "MANANA" ? "MAÑANA" : horario.turno}</p>
        <p>Estado del horario: {horario.estado}</p>
        <div className="flex items-center gap-2 py-3">
          <p>Periodo:</p>
          {periodoFiltro && (
            <Select
              onValueChange={(value) => {
                changePeriodoFiltro(value)
              }}
              value={periodoFiltro}
            >
              <SelectTrigger className="h-8 w-full px-1 sm:w-32 md:px-2">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                {horario.horarioPeriodos.map((periodo) => (
                  <SelectItem value={periodo.periodo} key={periodo.id}>
                    {periodo.periodo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            className="h-8"
            onClick={() => {
              modalCreate.onOpen()
            }}
          >
            Crear nuevo
          </Button>
        </div>
        {periodoFiltro && (
          <div className="flex items-center gap-2">
            <p>Instructor: </p>
            <Select
              onValueChange={(value) => {
                onAssignInstructorToPeriodo(value)
              }}
              disabled={isPending}
              value={currentPeriodo?.instructor?.id || "unassigned"}
            >
              <SelectTrigger className="h-8 w-full px-1 sm:w-48 md:px-2">
                <SelectValue placeholder="Sin asignar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Sin asignar</SelectItem>
                {instructores.map((instructor) => (
                  <SelectItem value={instructor.id} key={instructor.id}>
                    {instructor.nombre + " " + instructor.apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="py-3">
          <Button
            className="h-8"
            onClick={() => {
              modalCreateCustomer.onOpen()
            }}
          >
            Añadir cliente
          </Button>
        </div>
      </div>
      <ModalCreatePeriodo changePeriodoFiltro={changePeriodoFiltro} />
      <Modals periodo={periodoFiltro} />
    </>
  )
}
