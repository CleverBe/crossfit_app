import { create } from "zustand"

type ModalCreateType = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useCustomerModalCreate = create<ModalCreateType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
