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
import { useUserModalUpdate } from "../_hooks/use-user-modal"
import { AlertModal } from "@/components/modals/alertModal"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteUserFn } from "@/services/users"
import { toast } from "sonner"

interface CellActionProps {
  user: UserColumn
}

export const CellAction = ({ user }: CellActionProps) => {
  const router = useRouter()
  const userModal = useUserModalUpdate()
  const queryClient = useQueryClient()

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
        toast.success(`User ${user.name} deleted.`)
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
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              userModal.onOpen(user.id)
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpen(true)
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
