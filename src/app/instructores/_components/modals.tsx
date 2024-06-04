"use client"

import { useInstructorModalUpdate } from "../_hooks/useInstructorModal"
import { ModalCreate } from "./modal-create"
import { ModalUpdate } from "./modal-update"

export const Modals = () => {
  const modalUpdate = useInstructorModalUpdate()

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
