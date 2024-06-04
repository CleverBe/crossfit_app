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
import { TipoDePlanColumn } from "./columns"
import { useTipoDePlanModalUpdate } from "../_hooks/useTipoDePlanModal"
import { deleteTipoDePlanFn } from "@/services/tipoDePlanes"
import { useSession } from "next-auth/react"

interface CellActionProps {
  tipoDePlan: TipoDePlanColumn
}

export const CellAction = ({ tipoDePlan }: CellActionProps) => {
  const router = useRouter()
  const modalUpdate = useTipoDePlanModalUpdate()
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const user = session?.user

  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: deleteTipoDePlanFn,
  })

  const onDelete = async () => {
    mutate(tipoDePlan.id, {
      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: ["tiposDePlanes", tipoDePlan.id],
          exact: true,
        })
        queryClient.invalidateQueries({ queryKey: ["tiposDePlanes"] })
        router.refresh()
        toast.success(`Tipo de plan eliminado.`)
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
              modalUpdate.onOpen(tipoDePlan.id)
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
