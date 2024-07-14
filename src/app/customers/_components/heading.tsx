"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useCustomerModalCreate } from "../_hooks/useCustomerModal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Horario, PlanEstado } from "@prisma/client"
import { cn } from "@/lib/utils"

interface Props {
  customersLength: number
  horarios: Horario[]
}

export const Heading = ({ customersLength, horarios }: Props) => {
  const modalCreate = useCustomerModalCreate()

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleChangeFilter = ({
    key,
    term,
  }: {
    key: string
    term: string | null
  }) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set(key, term)
    } else {
      params.delete(key)
    }

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="p-5">
        <h1 className="text-2xl font-bold">{`Clientes (${customersLength})`}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => modalCreate.onOpen()}>
          <Plus className="mr h-4 w-4" />
          Añadir nuevo
        </Button>
        <Select
          onValueChange={(value) => {
            handleChangeFilter({
              key: "estado",
              term: value !== "unassigned" ? value : null,
            })
          }}
          defaultValue={searchParams.get("estado") || "unassigned"}
        >
          <SelectTrigger
            className={cn(
              "w-[200px]",
              searchParams.get("estado") !== PlanEstado.VIGENTE &&
                "border-red-300",
            )}
          >
            <SelectValue placeholder="Vigentes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Todos los estados</SelectItem>
            {Object.values(PlanEstado).map((estado) => (
              <SelectItem value={estado} key={estado}>
                {estado}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            handleChangeFilter({
              key: "horario",
              term: value !== "unassigned" ? value : null,
            })
          }}
          defaultValue={searchParams.get("horario") || "unassigned"}
        >
          <SelectTrigger
            className={cn(
              "w-[200px]",
              searchParams.get("horario") && "border-red-300",
            )}
          >
            <SelectValue placeholder="Todos los horarios" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Todos los horarios</SelectItem>
            {horarios.map((horario) => (
              <SelectItem value={horario.id} key={horario.id}>
                {horario.hora_inicio} - {horario.hora_fin}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
