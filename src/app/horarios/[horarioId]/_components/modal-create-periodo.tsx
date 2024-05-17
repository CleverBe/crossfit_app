"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormCreate } from "./form-create"
import { useHorarioPeriodoModalCreate } from "../_hooks/useHorarioPeriodoModal"

interface Props {
  changePeriodoFiltro: (newValue: string | null) => void
}

export function ModalCreatePeriodo({ changePeriodoFiltro }: Props) {
  const modalCreate = useHorarioPeriodoModalCreate()

  return (
    <Dialog open={modalCreate.isOpen} onOpenChange={modalCreate.onClose}>
      <DialogContent className="max-h-[calc(100vh-210px)] w-11/12 overflow-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Periodo</DialogTitle>
        </DialogHeader>
        <FormCreate changePeriodoFiltro={changePeriodoFiltro} />
      </DialogContent>
    </Dialog>
  )
}
