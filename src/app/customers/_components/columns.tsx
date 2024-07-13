"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"
import { PlanEstado } from "@prisma/client"

export type CustomerColumn = {
  id: string
  nombre: string
  genero: string
  celular: string
  cedula: string
  edad: string
  planEstado: PlanEstado
}

export const columns: ColumnDef<CustomerColumn>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "genero",
    header: "Genero",
  },
  {
    accessorKey: "celular",
    header: "Celular",
  },
  {
    accessorKey: "cedula",
    header: "Cedula",
  },
  {
    accessorKey: "edad",
    header: "Edad",
  },
  {
    accessorKey: "planEstado",
    header: "Plan",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction customer={row.original} />,
  },
]
