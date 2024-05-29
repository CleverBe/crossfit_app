import { Button } from "../ui/button"
import { ConfirmModal } from "./confirmModal"

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
  title?: string
  description?: string
}

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = "¿Estas seguro?",
  description = "Esta accion no se puede deshacer",
}: Props) => {
  return (
    <ConfirmModal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Confirmar
        </Button>
      </div>
    </ConfirmModal>
  )
}
