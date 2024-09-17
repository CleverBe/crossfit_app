"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormCreate } from "./form-create-plan"
import { useCustomerModalCreate } from "../_hooks/useCustomerModal"

export function ModalCreateCustomer() {
  const modalCreate = useCustomerModalCreate()

  return (
    <Dialog open={modalCreate.isOpen} onOpenChange={modalCreate.onClose}>
      <DialogContent className="max-h-[calc(100vh-200px)] w-11/12 overflow-auto sm:max-w-xl">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>Registrar cliente</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <FormCreate />
        </div>
      </DialogContent>
    </Dialog>
  )
}
