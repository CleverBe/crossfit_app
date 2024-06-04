"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { AsistenciasList } from "./asistencias/asistenciasList"
import { usePlan } from "../../_hooks/usePlan"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  planId: string
  isOpen: boolean
  onClose: () => void
}

export function ModalAsistenciasList({ planId, isOpen, onClose }: Props) {
  const { data, isFetching, isError } = usePlan(planId)

  if (isError && !isFetching) {
    toast.error("Something went wrong")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-11/12 overflow-auto sm:max-w-lg">
        <DialogHeader>
          {!data || isFetching ? (
            <Skeleton className="h-5 w-3/4 bg-neutral-200" />
          ) : (
            <DialogTitle className="w-11/12">
              {`Asistencias de ${data.cliente.nombre_completo} ${data.asistencias.length}/${data.tipoDePlan.cantidadDeClases}`}
            </DialogTitle>
          )}
        </DialogHeader>
        {!data || isFetching ? (
          <AsistenciasList.Skeleton />
        ) : (
          <AsistenciasList asistencias={data.asistencias} />
        )}
      </DialogContent>
    </Dialog>
  )
}
