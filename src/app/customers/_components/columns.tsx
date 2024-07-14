"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"

export type CustomerColumn = {
  id: string
  nombre: string
  genero: string
  celular: string
  cedula: string
  edad: string
  fecha_inicio: string
  fecha_fin: string
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
    accessorKey: "fecha_inicio",
    header: "Fecha inicio",
  },
  {
    accessorKey: "fecha_fin",
    header: "Fecha fin",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction customer={row.original} />,
  },
]
