"use client"

import { useTipoDePlanModalUpdate } from "../_hooks/useTipoDePlanModal"
import { ModalCreate } from "./modal-create"
import { ModalUpdate } from "./modal-update"

export const Modals = () => {
  const modalUpdate = useTipoDePlanModalUpdate()

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
