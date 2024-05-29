"use client"

import { useAsistenciasModal } from "../../_hooks/useAsistenciasModal"
import { useCustomerModalUpdate } from "../../_hooks/useCustomerModal"
import { usePlanModalUpdate } from "../../_hooks/usePlanModal"
import { ModalAsistenciasList } from "./modal-asistencias"
import { ModalCreateCustomer } from "./modal-create-customer"
import { ModalUpdateCustomer } from "./modal-update"
import { ModalUpdatePlan } from "./modalUpdatePlan"

interface Props {
  periodo: string | null
}

export const Modals = ({ periodo }: Props) => {
  const modalUpdate = useCustomerModalUpdate()
  const modalUpdatePlan = usePlanModalUpdate()
  const modalAsistencias = useAsistenciasModal()

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
      {modalAsistencias.id && (
        <ModalAsistenciasList
          planId={modalAsistencias.id}
          isOpen={modalAsistencias.isOpen}
          onClose={modalAsistencias.onClose}
        />
      )}
    </>
  )
}
