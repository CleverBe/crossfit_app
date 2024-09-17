"use client"

import { AlertModal } from "@/components/modals/alertModal"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { dayjsEs } from "@/lib/dayjs"
import { AsistenciaFromApi } from "@/schemas/asistencias"
import { deleteAsistenciaFn } from "@/services/asistencias"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface Props {
  asistencia: AsistenciaFromApi
}

export const AsistenciaCell = ({ asistencia }: Props) => {
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: deleteAsistenciaFn,
  })

  const onDelete = async () => {
    mutate(asistencia.id, {
      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: ["asistencias", asistencia.id],
          exact: true,
        })
        queryClient.invalidateQueries({ queryKey: ["asistencias"] })
        router.refresh()
        toast.success(`Asistencia eliminada.`)
        setOpen(false)
      },
      onError: () => {
        toast.error("Something went wrong.")
      },
    })
  }

  const asistenciaDate = dayjsEs(asistencia.fecha).format(
    "dddd D [de] MMMM [de] YYYY",
  )

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete()}
        loading={isPending}
      />
      <TableRow key={asistencia.id}>
        <TableCell className="p-1">
          {asistenciaDate.charAt(0).toUpperCase() + asistenciaDate.slice(1)}
        </TableCell>
        <TableCell className="p-1">
          {dayjsEs(asistencia.fecha).format("H:mm A")}
        </TableCell>
        <TableCell className="p-1">
          <Button
            size="sm"
            variant="outline"
            className="hover:bg-red-400"
            onClick={() => {
              setOpen(true)
            }}
          >
            <Trash className="size-4" />
          </Button>
        </TableCell>
      </TableRow>
    </>
  )
}
