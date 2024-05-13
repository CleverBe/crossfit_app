"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormCreate } from "./form-create"
import { useCustomerModalCreate } from "../../_hooks/useCustomerModal"

export function ModalCreate() {
  const modalCreate = useCustomerModalCreate()

  return (
    <Dialog open={modalCreate.isOpen} onOpenChange={modalCreate.onClose}>
      <DialogContent className="max-h-[calc(100vh-210px)] w-11/12 overflow-auto sm:w-[500px]">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>Create Customer Plan</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <FormCreate />
        </div>
      </DialogContent>
    </Dialog>
  )
}
