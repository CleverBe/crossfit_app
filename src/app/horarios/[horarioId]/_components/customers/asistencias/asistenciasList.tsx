import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AsistenciaFromApi } from "@/schemas/asistencias"
import { AsistenciaCell } from "./asistenciaCell"

interface Props {
  asistencias: AsistenciaFromApi[]
}

export const AsistenciasList = ({ asistencias }: Props) => {
  return (
    <div className="max-h-96 w-full overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead colSpan={2}>Hora</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asistencias.length > 0 ? (
            asistencias.map((asistencia) => (
              <AsistenciaCell key={asistencia.id} asistencia={asistencia} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-12 p-1 text-center">
                Sin resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

AsistenciasList.Skeleton = function AsistenciasListSkeleton() {
  return (
    <div className="">
      <div className="">
        <Skeleton className="h-10 w-full bg-neutral-200" />
      </div>
      <Separator className="my-1" />
      <div className="space-y-1">
        <Skeleton className="h-12 w-full bg-neutral-200" />
        <Skeleton className="h-12 w-full bg-neutral-200" />
        <Skeleton className="h-12 w-full bg-neutral-200" />
      </div>
    </div>
  )
}
