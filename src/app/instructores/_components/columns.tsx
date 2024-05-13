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
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
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
    id: "actions",
    cell: ({ row }) => <CellAction instructor={row.original} />,
  },
]
