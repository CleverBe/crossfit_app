"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"
import { Estado } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

export type HorarioColumn = {
  id: string
  hora_inicio: string
  hora_fin: string
  turno: string
  estado: Estado
}

export const columns: ColumnDef<HorarioColumn>[] = [
  {
    accessorKey: "hora_inicio",
    header: "Hora inicio",
  },
  {
    accessorKey: "hora_fin",
    header: "Hora fin",
  },
  {
    accessorKey: "turno",
    header: "Turno",
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
    cell: ({ row }) => <CellAction horario={row.original} />,
  },
]
