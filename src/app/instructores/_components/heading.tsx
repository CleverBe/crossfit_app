"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useInstructorModalCreate } from "../_hooks/useInstructorModal"

interface Props {
  instructoresLength: number
}

export const Heading = ({ instructoresLength }: Props) => {
  const modalCreate = useInstructorModalCreate()

  return (
    <div className="flex items-center justify-between">
      <div className="p-5">
        <h1 className="text-2xl font-bold">{`Instructores (${instructoresLength})`}</h1>
      </div>
      <Button onClick={() => modalCreate.onOpen()}>
        <Plus className="mr h-4 w-4" />
        Añadir nuevo
      </Button>
    </div>
  )
}
