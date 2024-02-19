import { create } from 'zustand';
import { IUserSettings } from './types/user';

type UserStore = {
  user: IUserSettings | null;
  setUser: (user: IUserSettings) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
