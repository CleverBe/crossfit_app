"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Contact, MoreHorizontal, NotepadText, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alertModal"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CustomerColumn } from "./columns"
import { useCustomerModalUpdate } from "../_hooks/useCustomerModal"
import { deleteDescuentoFn } from "@/services/descuentos"
import { useSession } from "next-auth/react"
import { useCustomerPlansModal } from "../_hooks/useCustomerPlansModal"

interface CellActionProps {
  customer: CustomerColumn
}

export const CellAction = ({ customer }: CellActionProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const user = session?.user

  const modalUpdateCustomer = useCustomerModalUpdate()
  const modalCustomerPlans = useCustomerPlansModal()

  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: deleteDescuentoFn,
  })

  const onDelete = async () => {
    mutate(customer.id, {
      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: ["customers", customer.id],
          exact: true,
        })
        queryClient.invalidateQueries({ queryKey: ["customers"] })
        router.refresh()
        toast.success(`Cliente eliminado.`)
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
              modalCustomerPlans.onOpen(customer.id)
            }}
          >
            <NotepadText className="mr-2 h-4 w-4" />
            Ver planes
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              modalUpdateCustomer.onOpen(customer.id)
            }}
          >
            <Contact className="mr-2 h-4 w-4" />
            Actualizar cliente
          </DropdownMenuItem>
          {user?.role === "ADMIN" && (
            <DropdownMenuItem
              onClick={() => {
                setOpen(true)
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
