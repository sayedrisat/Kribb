import {create} from "zustand";

interface UserState {
    isAdmin: boolean;
    setIsAdmin: (value: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
    isAdmin: false,
    setIsAdmin: (value) => set({ isAdmin: value})
}))