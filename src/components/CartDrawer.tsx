import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { formatPrice } from '../utils/format';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const items = useCartStore(state => state.items);
  const total = useCartStore(state => state.total());
  const removeItem = useCartStore(state => state.removeItem);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="text-black fixed top-0 right-0 h-full w-80 bg-white shadow-xl p-6 flex flex-col z-100"
        >
          <button
            onClick={onClose}
            className="self-end text-gray-600 hover:text-gray-900"
            aria-label="Cerrar carrito"
          >
            <X size={24} />
          </button>

          <h3 className="text-2xl font-semibold mb-4">Tu carrito</h3>

          <div className="flex-1 overflow-y-auto space-y-4">
            {items.length === 0 && (
              <p className="text-gray-500 text-center">No hay productos.</p>
            )}

            {items.map(item => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-800 truncate w-32">{item.title}</p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice((item.discountPrice ?? item.price) * item.quantity)}</p>
                  <button
                    onClick={() => removeItem(item.id, item.selectedSize)}
                    className="mt-1 text-xs text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <div className="pt-4 border-t w-full">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold">{formatPrice(total)}</span>
              </div>

              <Link
                onClick={onClose}
                to="/checkout"
                className="block w-full py-2 bg-blue-600 text-white hover:bg-blue-800 transition text-center"
              >
                Finalizar Compra
              </Link>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
