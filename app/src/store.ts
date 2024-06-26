import { create } from 'zustand';
import { ILove, IUserSettings } from './types/user';
import io, { Socket } from 'socket.io-client';
import { Filters } from './types/type';
import { IPreviewChat } from './types/chat';

type CarouselStore = {
  users: ILove[];
  setUsers: (users: ILove[]) => void;
};

type ChatsStore = {
  chats: IPreviewChat[];
  setChats: (chats: IPreviewChat[]) => void;
};

type DiscoverStore = {
  discover: ILove[];
  setDiscover: (discovers: ILove[]) => void;
};

type FiltersStore = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
};

type InterestsStore = {
  interests: string[];
  setInterests: (interests: string[]) => void;
};

type InterestsListStore = {
  interestsList: string[];
  setInterestsList: (interestsList: string[]) => void;
};

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

export const useCarouselStore = create<CarouselStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
}));

export const useChatsStore = create<ChatsStore>((set) => ({
  chats: [],
  setChats: (chats) => set({ chats }),
}));

export const useDiscoverStore = create<DiscoverStore>((set) => ({
  discover: [],
  setDiscover: (discover) => set({ discover }),
}));

export const useFiltersStore = create<FiltersStore>((set) => ({
  filters: {
    interests: [],
    minAge: 18,
    maxAge: 100,
    minFameRating: 0,
    maxFameRating: 5000,
    maxDistance: 0,
  },
  setFilters: (filters) => set({ filters }),
}));

export const useInterestsStore = create<InterestsStore>((set) => ({
  interests: [],
  setInterests: (interests: string[]) => set({ interests }),
}));

export const useInterestsListStore = create<InterestsListStore>((set) => ({
  interestsList: [],
  setInterestsList: (interestsList: string[]) => {
    set({ interestsList });
  },
}));

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  // Connect to the WebSocket server
  connect: () => {
    const socket = io(process.env.NEXT_PUBLIC_API, {
      withCredentials: true,
    });
    socket.on('connect', () => {
      set({ socket });
    });
  },
  // Disconnect from the WebSocket server
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
  // Send a message
  sendMessage: (value: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit('message', value);
    }
  },
}));
