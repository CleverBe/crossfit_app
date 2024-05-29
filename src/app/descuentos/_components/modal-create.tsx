"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormCreate } from "./form-create"
import { useDescuentoModalCreate } from "../_hooks/use-user-modal"

export function ModalCreate() {
  const modalCreate = useDescuentoModalCreate()

  return (
    <Dialog open={modalCreate.isOpen} onOpenChange={modalCreate.onClose}>
      <DialogContent className="max-h-[calc(100vh-210px)] w-11/12 overflow-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crear Descuento</DialogTitle>
        </DialogHeader>
        <FormCreate />
      </DialogContent>
    </Dialog>
  )
}
