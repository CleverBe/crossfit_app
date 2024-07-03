"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useCustomerModalCreate } from "../_hooks/useCustomerModal"

interface Props {
  customersLength: number
}

export const Heading = ({ customersLength }: Props) => {
  const modalCreate = useCustomerModalCreate()

  return (
    <div className="flex items-center justify-between">
      <div className="p-5">
        <h1 className="text-2xl font-bold">{`Clientes (${customersLength})`}</h1>
      </div>
      <Button onClick={() => modalCreate.onOpen()}>
        <Plus className="mr h-4 w-4" />
        Añadir nuevo
      </Button>
    </div>
  )
}
