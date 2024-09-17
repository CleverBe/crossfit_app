"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormCreate } from "./form-create"
import { useInstructorModalCreate } from "../_hooks/useInstructorModal"

export function ModalCreate() {
  const modalCreate = useInstructorModalCreate()

  return (
    <Dialog open={modalCreate.isOpen} onOpenChange={modalCreate.onClose}>
      <DialogContent className="max-h-[calc(100vh-200px)] w-11/12 overflow-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Instructor</DialogTitle>
        </DialogHeader>
        <FormCreate />
      </DialogContent>
    </Dialog>
  )
}
