import { create } from "zustand";

interface UserState {
  name: string;
  setName: (name: string) => void;
  resetName: () => void;
}

const userStore = create<UserState>((set) => ({
  name: "",
  setName: (name: string) => set({ name }),
  resetName: () => set({ name: "" }),
}));

export default userStore;
