"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUser } from "../_hooks/use-user"
import { FormUpdate } from "./form-update"
import { toast } from "sonner"

interface Props {
  id: string
  isOpen: boolean
  onClose: () => void
}

export function ModalUpdate({ id, isOpen, onClose }: Props) {
  const { data, isFetching, isError } = useUser(id)

  if (isError && !isFetching) {
    toast.error("Something went wrong")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[calc(100vh-210px)] w-11/12 overflow-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>
        {!data || isFetching ? (
          <FormUpdate.Skeleton />
        ) : (
          <FormUpdate user={data} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}
