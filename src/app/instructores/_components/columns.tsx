"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"

export type InstructorColumn = {
  id: string
  name: string
  email: string
  genero: string
  celular: string
}

export const columns: ColumnDef<InstructorColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Email",
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
    id: "actions",
    cell: ({ row }) => <CellAction instructor={row.original} />,
  },
]
