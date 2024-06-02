import { create } from "zustand";

type EditUserState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useEditUserDialog = create<EditUserState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
