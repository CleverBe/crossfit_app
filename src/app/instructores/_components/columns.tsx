"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"
import { Estado } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

export type InstructorColumn = {
  id: string
  name: string
  email: string
  genero: string
  celular: string
  estado: Estado
}

export const columns: ColumnDef<InstructorColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Correo electrónico",
  },
  {
    accessorKey: "genero",
    header: "Género",
  },
  {
    accessorKey: "celular",
    header: "Celular",
  },
  {
    accessorKey: "estado",
    header: "Celular",
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
    cell: ({ row }) => <CellAction instructor={row.original} />,
  },
]
