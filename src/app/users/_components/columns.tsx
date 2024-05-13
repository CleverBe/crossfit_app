"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"
import Image from "next/image"

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
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction user={row.original} />,
  },
]
