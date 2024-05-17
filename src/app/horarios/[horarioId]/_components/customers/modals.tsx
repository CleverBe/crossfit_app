"use client"

import { useCustomerModalUpdate } from "../../_hooks/useCustomerModal"
import { usePlanModalUpdate } from "../../_hooks/usePlanModal"
import { ModalCreateCustomer } from "./modal-create-customer"
import { ModalUpdateCustomer } from "./modal-update"
import { ModalUpdatePlan } from "./modalUpdatePlan"

interface Props {
  periodo: string | null
}

export const Modals = ({ periodo }: Props) => {
  const modalUpdate = useCustomerModalUpdate()
  const modalUpdatePlan = usePlanModalUpdate()

  return (
    <>
      {periodo && <ModalCreateCustomer periodo={periodo} />}
      {modalUpdate.id && (
        <ModalUpdateCustomer
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
    </>
  )
}
