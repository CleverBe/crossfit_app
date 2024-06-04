"use client"

import { useDescuentoModalUpdate } from "../_hooks/useDescuentoModal"
import { ModalCreate } from "./modal-create"
import { ModalUpdate } from "./modal-update"

export const Modals = () => {
  const modalUpdate = useDescuentoModalUpdate()

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
