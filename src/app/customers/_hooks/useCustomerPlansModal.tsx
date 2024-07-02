import { create } from "zustand"

type ModalType = {
  id: string | null
  isOpen: boolean
  onOpen: (id?: string) => void
  onClose: () => void
}

export const useCustomerPlansModal = create<ModalType>((set) => ({
  id: null,
  isOpen: false,
  onOpen: (id) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: null }),
}))
