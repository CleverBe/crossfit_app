import { create } from "zustand"

type ModalCreateType = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

type ModalUpdateType = {
  id: string | null
  isOpen: boolean
  onOpen: (id?: string) => void
  onClose: () => void
}

export const useCustomerModalCreate = create<ModalCreateType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export const useCustomerModalUpdate = create<ModalUpdateType>((set) => ({
  id: null,
  isOpen: false,
  onOpen: (id) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: null }),
}))
