"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useAsistencias } from "../../_hooks/useAsistencias"
import { AsistenciasList } from "./asistencias/asistenciasList"

interface Props {
  planId: string
  isOpen: boolean
  onClose: () => void
}

export function ModalAsistenciasList({ planId, isOpen, onClose }: Props) {
  const { data, isFetching, isError } = useAsistencias(planId)

  if (isError && !isFetching) {
    toast.error("Something went wrong")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[calc(100vh-210px)] w-11/12 overflow-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Lista de asistencias</DialogTitle>
        </DialogHeader>
        {!data || isFetching ? (
          <AsistenciasList.Skeleton />
        ) : (
          <AsistenciasList asistencias={data} />
        )}
      </DialogContent>
    </Dialog>
  )
}
