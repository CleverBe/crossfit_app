"use client"

import { useCustomerModalUpdate } from "../_hooks/useCustomerModal"
import { useCustomerPlansModal } from "../_hooks/useCustomerPlansModal"
import { useCustomerStatsModal } from "../_hooks/useCustomerStatsModal"
import { usePlanModalUpdate } from "../_hooks/usePlanModal"
import { ModalCustomerPlanStats } from "./modalCustomerPlanStats"
import { ModalCreateCustomer } from "./modalCreateCustomerPlan"
import { ModalCustomerPlans } from "./modalCustomerPlans"
import { ModalUpdateCustomer } from "./modalUpdateCustomer"
import { ModalUpdatePlan } from "./modalUpdatePlan"

export const Modals = () => {
  const modalUpdate = useCustomerModalUpdate()
  const modalUpdatePlan = usePlanModalUpdate()
  const modalCustomerPlans = useCustomerPlansModal()
  const modalCustomerStats = useCustomerStatsModal()

  return (
    <>
      <ModalCreateCustomer />
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
      {modalCustomerPlans.id && (
        <ModalCustomerPlans
          id={modalCustomerPlans.id}
          isOpen={modalCustomerPlans.isOpen}
          onClose={modalCustomerPlans.onClose}
        />
      )}
      {modalCustomerStats.id && (
        <ModalCustomerPlanStats
          id={modalCustomerStats.id}
          isOpen={modalCustomerStats.isOpen}
          onClose={modalCustomerStats.onClose}
        />
      )}
    </>
  )
}
