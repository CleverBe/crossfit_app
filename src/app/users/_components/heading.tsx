"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useUserModalCreate } from "../_hooks/use-user-modal"

interface Props {
  usersLength: number
}

export const Heading = ({ usersLength }: Props) => {
  const userModal = useUserModalCreate()

  return (
    <div className="flex items-center justify-between">
      <div className="p-5">
        <h1 className="text-2xl font-bold">{`Usuarios (${usersLength})`}</h1>
      </div>
      <Button onClick={() => userModal.onOpen()}>
        <Plus className="mr h-4 w-4" />
        Añadir nuevo
      </Button>
    </div>
  )
}
