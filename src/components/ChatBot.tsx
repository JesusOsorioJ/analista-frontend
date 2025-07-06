import React, { useEffect, useRef, useState } from 'react';
import { buildFilterPromptFromTypes, filterRawProducts, parseJsonFromMarkdown } from '../api/filterUtils';
import dataJson from '../../data.json';
import { useChatStore } from '../stores/useChatStore';
import type { RawProduct } from '../api/types';
import { motion } from 'framer-motion';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { consultaIA } from '../api/consultarIA';

const data = dataJson as unknown as RawProduct[];

export const ChatBot: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const open = useChatStore(state => state.open);
  const messages = useChatStore(state => state.messages);
  const input = useChatStore(state => state.input);
  const toggleOpen = useChatStore(state => state.toggleOpen);
  const addMessage = useChatStore(state => state.addMessage);
  const setInput = useChatStore(state => state.setInput);
  const clearHistory = useChatStore(state => state.clearHistory);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, open, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    addMessage({ from: 'user', text: userText, timestamp: new Date().toISOString() });
    setInput('');
    setLoading(true);
    addMessage({ from: 'bot', text: 'Escribiendo...', timestamp: new Date().toISOString() });

    try {
      const prompt = buildFilterPromptFromTypes(userText);
      const response = await consultaIA(prompt);
      const filters = parseJsonFromMarkdown(response) as Record<string, string | number>;
      const products = filterRawProducts(data, filters).slice(0, 3);

      // Remove 'Escribiendo...' placeholder
      // Assuming clearHistory or remove last bot message: stash messages then overwrite
      // Simpler: messages.pop logic, but using store: clear last bot placeholder
      const msgs = useChatStore.getState().messages;
      // Remove the last bot message if it is 'Escribiendo...'
      if (msgs[msgs.length - 1]?.text === 'Escribiendo...') {
        msgs.pop();
        useChatStore.setState({ messages: msgs });
      }

      const botText = products.length ? 'Encontré estos productos:' : 'No encontré productos.';
      addMessage({ from: 'bot', text: botText, timestamp: new Date().toISOString() });
      products.forEach(p => {
        addMessage({
          from: 'bot',
          text: `<a href="/product/${p.productId}" class="text-blue-300 hover:underline">${p.productName}</a>`,
          timestamp: new Date().toISOString()
        });
      });
    } catch (e) {
      addMessage({ from: 'bot', text: 'Error al procesar la solicitud.', timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Floating icon */}
      <motion.button
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="fixed bottom-6 right-6 text-4xl rounded-full z-50 shadow-md hover:scale-105 cursor-pointer"
        onClick={toggleOpen}
        aria-label="Abrir chat"
      >
        🤖
      </motion.button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-6 h-96 bg-gray-900 text-white shadow-2xl flex flex-col z-50 border border-gray-700"
        >
          {/* Header */}
          <div className="flex gap-5 justify-between items-center bg-gradient-to-r from-gray-900 to-gray-950 text-white px-4 py-2">
            <span className="font-semibold">Vélez IA: Consulta nuestros productos</span>
            <div className="flex items-center space-x-2">
              <button
                title="Eliminar historial"
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que deseas eliminar el historial de chat?')) {
                    clearHistory();
                  }
                }}
                className="text-sm hover:text-gray-300 cursor-pointer"
              >
                🗑️
              </button>
              <button
                title="Cerrar chat"
                onClick={toggleOpen}
                className="text-lg hover:text-gray-300 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={containerRef} className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-800">
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div>
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg shadow ${
                      m.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
                    }`}
                    dangerouslySetInnerHTML={{ __html: m.text }}
                  />
                  <div className="text-xs text-gray-400 mt-1 text-right">
                    {formatTime(m.timestamp || new Date().toISOString())}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  <span className="text-gray-400">Procesando...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-2 border-t border-gray-700 bg-gray-900 flex items-center gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Camisa polo, talla xs, color negro, o simple zapatos mujer"
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-full px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button onClick={handleSend} className="text-blue-400 hover:text-blue-600 cursor-pointer">
              <PaperPlaneIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};
