import { create } from 'zustand';
import { IUserSettings } from './types/user';
import io, { Socket } from 'socket.io-client';

type UserStore = {
  user: IUserSettings | null;
  setUser: (user: IUserSettings) => void;
};

type SocketStore = {
  socket: Socket;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (value: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  connect: () => {
    const socket = io('http://localhost:3001', {
      auth: {
        token: 'my-token'
      }
    });
    socket.on('connect', () => {
      set({ socket });
    });
  },
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
  sendMessage: (value: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit('message', value);
    }
  },
}));
