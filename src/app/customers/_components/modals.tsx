"use client"

import { useCustomerModalUpdate } from "../_hooks/useCustomerModal"
import { ModalUpdate } from "./modal-update"

export const Modals = () => {
  const modalUpdate = useCustomerModalUpdate()

  return (
    <>
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
