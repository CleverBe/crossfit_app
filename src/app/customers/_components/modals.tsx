"use client"

import { useCustomerModalUpdate } from "../_hooks/useCustomerModal"
import { useCustomerPlansModal } from "../_hooks/useCustomerPlansModal"
import { usePlanModalUpdate } from "../_hooks/usePlanModal"
import { ModalCreateCustomer } from "./modal-create-customer"
import { ModalCustomerPlans } from "./modal-customer-plans"
import { ModalUpdate } from "./modal-update"
import { ModalUpdatePlan } from "./modalUpdatePlan"

export const Modals = () => {
  const modalUpdate = useCustomerModalUpdate()
  const modalUpdatePlan = usePlanModalUpdate()
  const modalCustomerPlans = useCustomerPlansModal()

  return (
    <>
      <ModalCreateCustomer />
      {modalUpdate.id && (
        <ModalUpdate
          id={modalUpdate.id}
          isOpen={modalUpdate.isOpen}
          onClose={modalUpdate.onClose}
        />
      )}
      {modalUpdatePlan.id && (
        <ModalUpdatePlan
          id={modalUpdatePlan.id}
          isOpen={modalUpdatePlan.isOpen}
          onClose={modalUpdatePlan.onClose}
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
