"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"

export type CustomerPlanColumn = {
  clienteId: string
  planId: string
  nombre: string
  celular: string
  cedula: string
  edad: string
  fecha_inicio: string
  fecha_fin: string
}

export const columns: ColumnDef<CustomerPlanColumn>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
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
