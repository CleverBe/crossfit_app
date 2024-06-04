"use client"

import { useUserModalUpdate } from "../_hooks/useUserModal"
import { ModalCreate } from "./modal-create"
import { ModalUpdate } from "./modal-update"

export const Modals = () => {
  const modalUpdate = useUserModalUpdate()

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
