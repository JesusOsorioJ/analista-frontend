import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import type { SimplifiedProduct } from '../api/types';

export interface CartItem extends SimplifiedProduct {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string, size: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: item => {
        const exists = get().items.find(i => i.id === item.id && i.selectedSize === item.selectedSize && i.selectedColor === item.selectedColor);
        if (exists) {
          set({ items: get().items.map(i =>
            i.id === item.id && i.selectedSize === item.selectedSize && i.selectedColor === item.selectedColor
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ) });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (itemId, size) => set({ items: get().items.filter(i => !(i.id === itemId && i.selectedSize === size)) }),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((acc, i) => acc + (i.discountPrice ?? i.price) * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
