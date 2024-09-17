import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { FormUpdateStats } from "./stats/FormUpdateStats"
import { usePlan } from "../_hooks/usePlan"

interface Props {
  id: string
  isOpen: boolean
  onClose: () => void
}

export function ModalCustomerPlanStats({ id, isOpen, onClose }: Props) {
  const { data, isFetching, isError } = usePlan(id)

  if (isError && !isFetching) {
    toast.error("Something went wrong")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[calc(100vh-200px)] w-11/12 overflow-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Editar estadisticas / marcas de {data?.cliente.nombre_completo}
          </DialogTitle>
        </DialogHeader>
        {!data || isFetching ? (
          <FormUpdateStats.Skeleton />
        ) : (
          <FormUpdateStats plan={data} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}
