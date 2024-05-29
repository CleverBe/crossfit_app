"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"
import { Estado } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

export type DescuentoColumn = {
  id: string
  titulo: string
  porcentaje: string
  estado: Estado
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
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => (
      <Badge
        variant={`${row.original.estado === "ACTIVO" ? "default" : "destructive"}`}
      >
        {row.original.estado}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction descuento={row.original} />,
  },
]
