"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"

export type DescuentoColumn = {
  id: string
  titulo: string
  porcentaje: string
}

export const columns: ColumnDef<DescuentoColumn>[] = [
  {
    accessorKey: "titulo",
    header: "Titulo",
  },
  {
    accessorKey: "porcentaje",
    header: "Porcentaje",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction descuento={row.original} />,
  },
]
