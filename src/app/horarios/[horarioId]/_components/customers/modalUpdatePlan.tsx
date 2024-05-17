"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { FormUpdatePlan } from "./formUpdatePlan"
import { usePlan } from "../../_hooks/usePlan"

interface Props {
  id: string
  isOpen: boolean
  onClose: () => void
}

export function ModalUpdatePlan({ id, isOpen, onClose }: Props) {
  const { data, isFetching, isError } = usePlan(id)

  if (isError && !isFetching) {
    toast.error("Something went wrong")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[calc(100vh-210px)] w-11/12 overflow-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Plan</DialogTitle>
        </DialogHeader>
        {!data || isFetching ? (
          <FormUpdatePlan.Skeleton />
        ) : (
          <FormUpdatePlan plan={data} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}
