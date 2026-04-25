import { create } from 'zustand';

const useVigyaanStore = create((set, get) => ({
  isOpen: false,

  openVigyaan: () => set({ isOpen: true }),
  closeVigyaan: () => set({ isOpen: false }),
  getIsOpen: () => get().isOpen,
}));

export default useVigyaanStore;
