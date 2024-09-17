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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
      <DialogContent className="max-h-[calc(100vh-200px)] w-11/12 overflow-auto sm:max-w-2xl">
        <DialogHeader>
          {data && (
            <DialogTitle>
              Listado de planes de {data.nombre_completo}
            </DialogTitle>
          )}
        </DialogHeader>
        {!data || isFetching ? (
          <div className="flex items-center justify-center p-5">
            <svg
              className="h-5 w-5 animate-spin text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
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
                <div className="">
                  <p className="text-base">
                    {`Duración: `}
                    <span className="font-medium">{`${dayjsEs(plan.fecha_inicio).format("DD/MM/YYYY")}`}</span>
                    {" - "}
                    <span className="font-medium">{`${dayjsEs(plan.fecha_fin).format("DD/MM/YYYY")}`}</span>
                  </p>
                </div>
                <p className="text-base">
                  Instructor:{" "}
                  <span className="font-medium">
                    {`${plan.instructor.nombre} ${plan.instructor.apellido}`}
                  </span>
                </p>
                <p className="text-base">
                  Peso:{" "}
                  <span className="font-medium">
                    {plan.peso_cliente ?? "-"}
                  </span>{" "}
                  kg
                </p>
                <p className="text-base">
                  Estatura:{" "}
                  <span className="font-medium">
                    {plan.estatura_cliente ?? "-"}
                  </span>{" "}
                  cm
                </p>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Asistencias</AccordionTrigger>
                    <AccordionContent>
                      <div className="rounded-sm border border-gray-200 p-1">
                        <ul className="text-center">
                          <AsistenciasList asistencias={plan.asistencias} />
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
