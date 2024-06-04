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
import { UserColumn } from "./columns"
import { useUserModalUpdate } from "../_hooks/useUserModal"
import { AlertModal } from "@/components/modals/alertModal"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteUserFn } from "@/services/users"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface CellActionProps {
  user: UserColumn
}

export const CellAction = ({ user }: CellActionProps) => {
  const router = useRouter()
  const userModal = useUserModalUpdate()
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const userSession = session?.user

  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: deleteUserFn,
  })

  const onDelete = async () => {
    mutate(user.id, {
      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: ["users", user.id],
          exact: true,
        })
        queryClient.invalidateQueries({ queryKey: ["users"] })
        router.refresh()
        toast.success(`Usuario ${user.name} eliminado.`)
        setOpen(false)
      },
      onError: () => {
        toast.error("Something went wrong.")
      },
    })
  }

  if (userSession?.role !== "ADMIN") return null

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
              userModal.onOpen(user.id)
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Actualizar
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
