"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useUserModalCreate } from "../_hooks/useUserModal"
import { useSession } from "next-auth/react"

interface Props {
  usersLength: number
}

export const Heading = ({ usersLength }: Props) => {
  const userModal = useUserModalCreate()
  const { data: session } = useSession()
  const user = session?.user

  return (
    <div className="flex items-center justify-between">
      <div className="p-5">
        <h1 className="text-2xl font-bold">{`Usuarios (${usersLength})`}</h1>
      </div>
      {user?.role === "ADMIN" && (
        <Button onClick={() => userModal.onOpen()}>
          <Plus className="mr h-4 w-4" />
          Añadir nuevo
        </Button>
      )}
    </div>
  )
}
