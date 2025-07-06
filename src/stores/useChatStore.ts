import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Message = {
  from: 'user' | 'bot';
  text: string;
  timestamp: string; // ← NUEVO
};

interface ChatState {
  open: boolean;
  messages: Message[];
  input: string;
  toggleOpen: () => void;
  addMessage: (msg: Message) => void;
  setInput: (val: string) => void;
  clearHistory: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      open: false,
      messages: [],
      input: '',
      toggleOpen: () => set(state => ({ open: !state.open })),
      addMessage: msg => set(state => ({
        messages: [...state.messages, msg]
      })),
      setInput: val => set({ input: val }),
      clearHistory: () => set({ messages: [] }),
    }),
    { name: 'chat-storage' }
  )
);
