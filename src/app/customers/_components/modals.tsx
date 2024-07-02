"use client"

import { useCustomerModalUpdate } from "../_hooks/useCustomerModal"
import { useCustomerPlansModal } from "../_hooks/useCustomerPlansModal"
import { ModalCustomerPlans } from "./modal-customer-plans"
import { ModalUpdate } from "./modal-update"

export const Modals = () => {
  const modalUpdate = useCustomerModalUpdate()
  const modalCustomerPlans = useCustomerPlansModal()

  return (
    <>
      {modalUpdate.id && (
        <ModalUpdate
          id={modalUpdate.id}
          isOpen={modalUpdate.isOpen}
          onClose={modalUpdate.onClose}
        />
      )}
      {modalCustomerPlans.id && (
        <ModalCustomerPlans
          id={modalCustomerPlans.id}
          isOpen={modalCustomerPlans.isOpen}
          onClose={modalCustomerPlans.onClose}
        />
      )}
    </>
  )
}
