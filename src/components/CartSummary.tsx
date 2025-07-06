import React, { useEffect, useRef, useState } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { formatPrice } from '../utils/format';
import { motion, AnimatePresence } from 'framer-motion';

export const CartSummary: React.FC = () => {
  const items = useCartStore(state => state.items);
  const total = useCartStore(state => state.total());
  const removeItem = useCartStore(state => state.removeItem);

  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    setVisible(true);
    if (timeoutRef.current) {clearTimeout(timeoutRef.current);}
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 3000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [items]);

  return (
    <div className="relative inline-block text-black">
      <button className="relative p-2">
        🛒
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 z-50">
          {items.length}
        </span>
      </button>

      <AnimatePresence>
        {visible && location.pathname.includes("/product") && (
          <motion.div
            key="cart-summary"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl p-4 z-50"
          >
            <h4 className="font-semibold mb-2">Carrito</h4>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {items.map(item => (
                <li key={`${item.id}-${item.selectedSize}`} className="flex justify-between">
                  <div className="truncate w-32">
                    <p className="truncate">{item.title}</p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p>{formatPrice((item.discountPrice ?? item.price) * item.quantity)}</p>
                    <button
                      onClick={() => removeItem(item.id, item.selectedSize)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t pt-2 mt-2">
              <p className="font-bold">Total: {formatPrice(total)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
