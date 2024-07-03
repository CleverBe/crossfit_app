"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Contact, MoreHorizontal, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alertModal"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { PlanColumn } from "./columns"
import { useCustomerModalUpdate } from "../../_hooks/useCustomerModal"
import { deletePlanFn } from "@/services/plan"
interface CellActionProps {
  plan: PlanColumn
}

export const CellAction = ({ plan }: CellActionProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)

  const modalUpdateCustomer = useCustomerModalUpdate()

  const { mutate, isPending } = useMutation({
    mutationFn: deletePlanFn,
  })

  const onDelete = async () => {
    mutate(plan.id, {
      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: ["planes", plan.id],
          exact: true,
        })
        queryClient.invalidateQueries({ queryKey: ["planes"] })
        router.refresh()
        toast.success(`Plan eliminado.`)
        setOpen(false)
      },
      onError: () => {
        toast.error("Something went wrong.")
      },
    })
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete()}
        loading={isPending}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              modalUpdateCustomer.onOpen(plan.customerId)
            }}
          >
            <Contact className="mr-2 h-4 w-4" />
            Detalles cliente
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpen(true)
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
