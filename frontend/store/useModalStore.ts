import { create } from "zustand";
import { Schedule } from "@/interfaces";

type ModalAction = "edit" | "delete" | "start" | "end" | null;

interface ModalState {
  isOpen: boolean;
  action: ModalAction;
  schedule?: Schedule | null;
}

interface ModalStore {
  modalState: ModalState;
  openModal: (schedule: Schedule, action: ModalAction) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modalState: { isOpen: false, action: null, schedule: null },

  openModal: (schedule, action) =>
    set({ modalState: { isOpen: true, action, schedule } }),

  closeModal: () =>
    set({ modalState: { isOpen: false, action: null, schedule: null } }),
}));
