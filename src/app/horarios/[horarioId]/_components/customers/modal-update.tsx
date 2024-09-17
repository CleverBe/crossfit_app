"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useCustomer } from "../../_hooks/useCustomer"
import { FormUpdateCustomer } from "./form-customer"

interface Props {
  id: string
  isOpen: boolean
  onClose: () => void
}

export function ModalUpdateCustomer({ id, isOpen, onClose }: Props) {
  const { data, isFetching, isError } = useCustomer(id)

  if (isError && !isFetching) {
    toast.error("Something went wrong")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[calc(100vh-200px)] w-11/12 overflow-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar cliente</DialogTitle>
        </DialogHeader>
        {!data || isFetching ? (
          <FormUpdateCustomer.Skeleton />
        ) : (
          <FormUpdateCustomer customer={data} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}
