"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"

export type PlanColumn = {
  id: string
  customerId: string
  nombre: string
  celular: string
  cedula: string
  tipoDePlan: string
  fecha_inicio: string
  fecha_fin: string
}

export const columns: ColumnDef<PlanColumn>[] = [
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
    accessorKey: "tipoDePlan",
    header: "Tipo de plan",
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
    cell: ({ row }) => <CellAction plan={row.original} />,
  },
]
