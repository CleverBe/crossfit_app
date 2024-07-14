import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useCustomerPlans } from "../_hooks/useCustomerPlans"
import { dayjsEs } from "@/lib/dayjs"
import { AsistenciasList } from "./asistencias/asistenciasList"
import { cn } from "@/lib/utils"
import { PlanEstado } from "@prisma/client"

interface Props {
  id: string
  isOpen: boolean
  onClose: () => void
}

export function ModalCustomerPlans({ id, isOpen, onClose }: Props) {
  const { data, isFetching, isError } = useCustomerPlans(id)

  if (isError && !isFetching) {
    toast.error("Something went wrong")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[calc(100vh-210px)] w-11/12 overflow-auto sm:max-w-lg">
        <DialogHeader>
          {data && (
            <DialogTitle>
              Listado de planes de {data.nombre_completo}
            </DialogTitle>
          )}
        </DialogHeader>
        {!data || isFetching ? (
          <>Cargando...</>
        ) : (
          <ul className="space-y-4">
            {data.planes.map((plan) => (
              <li key={plan.id} className="m-1 rounded-md border p-5">
                <h1
                  className={cn(
                    "text-center text-lg",
                    plan.estado === PlanEstado.VIGENTE
                      ? "font-bold"
                      : "font-normal",
                  )}
                >
                  {plan.estado}
                </h1>
                <p className="text-base">
                  Inicio:{" "}
                  <span className="font-medium">{`${dayjsEs(plan.fecha_inicio).format("DD/MM/YYYY")}`}</span>
                </p>
                <p className="text-base">
                  Fin:{" "}
                  <span className="font-medium">{`${dayjsEs(plan.fecha_fin).format("DD/MM/YYYY")}`}</span>
                </p>
                <p className="text-base">
                  Peso:{" "}
                  <span className="font-medium">
                    {plan.peso_cliente ?? "-"}
                  </span>
                </p>
                <p className="text-base">
                  Estatura:{" "}
                  <span className="font-medium">
                    {plan.estatura_cliente ?? "-"}
                  </span>
                </p>
                <div className="mt-2 rounded-sm border border-gray-200 p-1">
                  <h2 className="text-center text-base font-semibold">
                    Asistencias
                  </h2>
                  <ul className="text-center">
                    <AsistenciasList asistencias={plan.asistencias} />
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
