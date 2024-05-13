"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormUpdate } from "./form-update"
import { toast } from "sonner"
import { useHorario } from "../_hooks/use-user"

interface Props {
  id: string
  isOpen: boolean
  onClose: () => void
}

export function ModalUpdate({ id, isOpen, onClose }: Props) {
  const { data, isFetching, isError } = useHorario(id)

  if (isError && !isFetching) {
    toast.error("Something went wrong")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[calc(100vh-210px)] w-11/12 overflow-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Horario</DialogTitle>
        </DialogHeader>
        {!data || isFetching ? (
          <FormUpdate.Skeleton />
        ) : (
          <FormUpdate horario={data} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}
