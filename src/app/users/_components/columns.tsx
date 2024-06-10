"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export type UserColumn = {
  id: string
  name: string
  email: string
  role: string
  image?: string
}

export const columns: ColumnDef<UserColumn>[] = [
  {
    id: "avatar",
    cell: ({ row }) => (
      <Image
        width={50}
        height={50}
        src={
          row.original.image ||
          "https://res.cloudinary.com/dldf8bt5g/image/upload/v1686697003/Users/default_user_jr8kfs.png"
        }
        alt="User avatar"
        className="h-[50px] rounded-full object-cover object-center"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Correo electrónico",
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => (
      <Badge
        variant={`${row.original.role === "ADMIN" ? "default" : "secondary"}`}
      >
        {row.original.role}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction user={row.original} />,
  },
]
