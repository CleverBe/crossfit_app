"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"

export type TipoDePlanColumn = {
  id: string
  tipo: string
  dias: string[]
  costo: string
}

export const columns: ColumnDef<TipoDePlanColumn>[] = [
  {
    accessorKey: "tipo",
    header: "Tipo",
  },
  {
    accessorKey: "dias",
    header: "Dias",
  },
  {
    accessorKey: "costo",
    header: "Costo Bs",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction tipoDePlan={row.original} />,
  },
]
