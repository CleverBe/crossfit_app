"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alertModal"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { HorarioColumn } from "./columns"
import { useHorarioModalUpdate } from "../_hooks/useHorarioModal"
import { deleteHorarioFn } from "@/services/horarios"
import { useSession } from "next-auth/react"

interface CellActionProps {
  horario: HorarioColumn
}

export const CellAction = ({ horario }: CellActionProps) => {
  const router = useRouter()
  const modalUpdate = useHorarioModalUpdate()
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const user = session?.user

  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: deleteHorarioFn,
  })

  const onDelete = async () => {
    mutate(horario.id, {
      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: ["horarios", horario.id],
          exact: true,
        })
        queryClient.invalidateQueries({ queryKey: ["horarios"] })
        router.refresh()
        toast.success(`Horario eliminado.`)
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
              router.push(`/horarios/${horario.id}`)
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            Revisar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              modalUpdate.onOpen(horario.id)
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
