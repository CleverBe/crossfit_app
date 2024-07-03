"use client"

import { useCustomerModalUpdate } from "../../_hooks/useCustomerModal"
import { ModalUpdateCustomer } from "./modal-update"

export const Modals = () => {
  const modalUpdate = useCustomerModalUpdate()

  return (
    <>
      {modalUpdate.id && (
        <ModalUpdateCustomer
          id={modalUpdate.id}
          isOpen={modalUpdate.isOpen}
          onClose={modalUpdate.onClose}
        />
      )}
    </>
  )
}
