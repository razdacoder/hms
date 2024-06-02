import { create } from "zustand";

type EditUserState = {
  user?: User;
  isOpen: boolean;
  onOpen: (user: User) => void;
  onClose: () => void;
};

export const useEditUserDialog = create<EditUserState>((set) => ({
  isOpen: false,
  onOpen: (user: User) => set({ isOpen: true, user: user }),
  onClose: () => set({ isOpen: false, user: undefined }),
}));
