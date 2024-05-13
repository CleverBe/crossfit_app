"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUserModalCreate } from "../_hooks/use-user-modal"
import { FormCreate } from "./form-create"

export function ModalCreate() {
  const modalCreate = useUserModalCreate()

  return (
    <Dialog open={modalCreate.isOpen} onOpenChange={modalCreate.onClose}>
      <DialogContent className="max-h-[calc(100vh-210px)] w-11/12 overflow-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>
        <FormCreate />
      </DialogContent>
    </Dialog>
  )
}
