"use client"

import { useHorarioModalUpdate } from "../_hooks/useHorarioModal"
import { ModalCreate } from "./modal-create"
import { ModalUpdate } from "./modal-update"

export const Modals = () => {
  const modalUpdate = useHorarioModalUpdate()

  return (
    <>
      <ModalCreate />
      {modalUpdate.id && (
        <ModalUpdate
          id={modalUpdate.id}
          isOpen={modalUpdate.isOpen}
          onClose={modalUpdate.onClose}
        />
      )}
    </>
  )
}
