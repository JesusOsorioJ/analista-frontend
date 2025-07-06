// src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { formatPrice } from '../utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const items = useCartStore(state => state.items);
  const total = useCartStore(state => state.total());
  const clearCart = useCartStore(state => state.clearCart);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirm = () => {
    setProcessing(true);
    setTimeout(() => {
      clearCart();
      setProcessing(false);
      setSuccess(true);
    }, 2000); // simula procesamiento
  };

  return (
    <div className=" flex flex-col py-20 px-10">
      <main className="container mx-auto p-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Proceso de Pago</h1>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No hay productos en el carrito.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map(i => (
              <div key={`${i.id}-${i.selectedSize}`} className="flex items-center justify-between bg-white shadow p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img src={i.images[0]} alt={i.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <p className="font-medium text-gray-800 truncate w-48">{i.title}</p>
                    <p className="text-sm text-gray-500">Talla: {i.selectedSize}, Color: {i.selectedColor}</p>
                    <p className="text-sm text-gray-500">Cantidad: {i.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-800">{formatPrice((i.discountPrice ?? i.price) * i.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-4 flex justify-between text-lg font-bold">
              <span>Total a pagar:</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              onClick={handleConfirm}
              disabled={processing}
              className="mt-6 w-full py-3 bg-green-600 text-white hover:bg-green-700 transition shadow-lg text-center font-semibold disabled:opacity-50"
            >
              {processing ? 'Procesando pago...' : 'Confirmar Pago'}
            </button>
          </div>
        )}
      </main>

      {/* Loader overlay */}
      <AnimatePresence>
        {processing && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-20 h-20 border-4 border-t-4 border-gray-200 border-t-green-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de éxito */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-sm text-center shadow-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <XCircle size={48} className="mx-auto text-green-600" />
              <h2 className="text-2xl font-bold mt-4">¡Pedido en camino!</h2>
              <p className="mt-2 text-gray-600">Tus productos ya están en camino y llegarán pronto.</p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
