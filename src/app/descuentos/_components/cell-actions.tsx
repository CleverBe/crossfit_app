"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alertModal"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { DescuentoColumn } from "./columns"
import { useDescuentoModalUpdate } from "../_hooks/useDescuentoModal"
import { deleteDescuentoFn } from "@/services/descuentos"
import { useSession } from "next-auth/react"

interface CellActionProps {
  descuento: DescuentoColumn
}

export const CellAction = ({ descuento }: CellActionProps) => {
  const router = useRouter()
  const modalUpdate = useDescuentoModalUpdate()
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const user = session?.user

  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: deleteDescuentoFn,
  })

  const onDelete = async () => {
    mutate(descuento.id, {
      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: ["descuentos", descuento.id],
          exact: true,
        })
        queryClient.invalidateQueries({ queryKey: ["descuentos"] })
        router.refresh()
        toast.success(`Descuento eliminado.`)
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
              modalUpdate.onOpen(descuento.id)
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Actualizar
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
