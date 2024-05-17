import { create } from "zustand"

type ModalUpdateType = {
  id: string | null
  isOpen: boolean
  onOpen: (id?: string) => void
  onClose: () => void
}
export const usePlanModalUpdate = create<ModalUpdateType>((set) => ({
  id: null,
  isOpen: false,
  onOpen: (id) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: null }),
}))
