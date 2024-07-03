"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useCustomerPlans } from "../_hooks/useCustomerPlans"
import { dayjsEs } from "@/lib/dayjs"
import { AsistenciasList } from "./asistencias/asistenciasList"

interface Props {
  id: string
  isOpen: boolean
  onClose: () => void
}

export function ModalCustomerPlans({ id, isOpen, onClose }: Props) {
  const { data, isFetching, isError } = useCustomerPlans(id)

  if (isError && !isFetching) {
    toast.error("Something went wrong")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[calc(100vh-210px)] w-11/12 overflow-auto sm:max-w-lg">
        <DialogHeader>
          {data && (
            <DialogTitle>
              Listado de planes de {data.nombre_completo}
            </DialogTitle>
          )}
        </DialogHeader>
        {!data || isFetching ? (
          <>Cargando...</>
        ) : (
          <ul className="space-y-4">
            {data.planes.map((plan) => (
              <li key={plan.id} className="m-1 rounded-md border p-5">
                <h1 className="text-center text-lg font-bold">{plan.estado}</h1>
                <p>
                  Inicio: {`${dayjsEs(plan.fecha_inicio).format("DD/MM/YYYY")}`}
                </p>
                <p>Fin: {`${dayjsEs(plan.fecha_fin).format("DD/MM/YYYY")}`}</p>
                <p>Peso del cliente: {plan.peso_cliente ?? "-"}</p>
                <p>Estatura del cliente: {plan.estatura_cliente ?? "-"}</p>
                <h2 className="text-center text-base font-semibold">
                  Asistencias
                </h2>
                <ul className="text-center">
                  <AsistenciasList asistencias={plan.asistencias} />
                </ul>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
