"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useDescuentoModalCreate } from "../_hooks/use-user-modal"

interface Props {
  descuentosLength: number
}

export const Heading = ({ descuentosLength }: Props) => {
  const modalCreate = useDescuentoModalCreate()

  return (
    <div className="flex items-center justify-between">
      <div className="p-5">
        <h1 className="text-2xl font-bold">{`Descuentos (${descuentosLength})`}</h1>
      </div>
      <Button onClick={() => modalCreate.onOpen()}>
        <Plus className="mr h-4 w-4" />
        Add new
      </Button>
    </div>
  )
}
