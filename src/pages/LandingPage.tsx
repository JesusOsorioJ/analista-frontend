// src/pages/LandingPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { fetchRelated } from '../api/products';
import type { SimplifiedProduct } from '../api/types';
import { useFetch } from '../hooks/useFetch';
import { ProductCard } from '../components/ProductCard';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const [products, setProducts] = useState<SimplifiedProduct[]>([]);
  const [filter, setFilter] = useState('');
  const { loading, error, run } = useFetch(async () => {
    const list = await fetchRelated('tenis', 50);
    setProducts(list);
  });
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { run(); }, []);

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 6);

  const scrollToCatalog = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col  text-white">
      {/* Hero Section with Video Background */}
      <section className="relative flex items-center justify-center h-screen overflow-hidden">
        <img
          className="fixed z-[-10] top-0 left-0 w-full h-full object-cover filter brightness-50"
          src="pexels-eberhardgross-1428277.jpg"
        />
        <div className="relative text-center p-4">
          <h1 className="text-5xl font-extrabold mb-4">Vive la experiencia urbana</h1>
          <p className="text-xl mb-6 text-gray-200">
            Explora nuestra colección premium de tenis, diseñados para destacarte.
          </p>
          <button
            onClick={scrollToCatalog}
            className="btn-fill-from-bottom relative overflow-hidden px-8 py-3 bg-white text-black text-lg font-semibold group z-0"
          >
            <span className="relative z-10">Mira los Productos</span>
          </button>
        </div>
      </section>


      {/* Pre-Landing Informational Section Dark Theme */}
      <section className="py-20 px-10 mx-15 bg-gray-900">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          {/* Text Content */}
          <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
            <h2 className="text-4xl font-extrabold mb-6">¿Por qué elegirnos?</h2>
            <p className="text-lg mb-8 text-gray-300">
              Calidad, estilo y comodidad en cada paso. Descubre nuestra selección curada de tenis premium para cada ocasión.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="h-8 w-8 bg-indigo-600 text-white flex items-center justify-center rounded-full mr-4">🌟</div>
                <div>
                  <h3 className="text-xl font-semibold">Envío Gratis</h3>
                  <p className="text-gray-400">Pedidos superiores a <strong>$100</strong></p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-8 w-8 bg-teal-600 text-white flex items-center justify-center rounded-full mr-4">↩️</div>
                <div>
                  <h3 className="text-xl font-semibold">Devoluciones 30 Días</h3>
                  <p className="text-gray-400">Sin preguntas y sin costo</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-8 w-8 bg-pink-600 text-white flex items-center justify-center rounded-full mr-4">💬</div>
                <div>
                  <h3 className="text-xl font-semibold">Soporte 24/7</h3>
                  <p className="text-gray-400">Siempre a tu disposición</p>
                </div>
              </div>
            </div>
          </div>
          {/* Image */}
          <div className="w-full md:w-1/2 px-4">
            <img
              src="pexels-eberhardgross-1428277.jpg"
              alt="Selección de tenis premium"
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Catalog Section Dark Theme */}
      <main className="container mx-auto px-4 py-12" ref={productsRef}>
        <h2 className="text-3xl font-bold mb-6 text-center">Selección Destacada</h2>
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Filtrar..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full max-w-md border border-gray-700 bg-gray-800 text-white p-2 rounded shadow-md focus:outline-none focus:border-red-500"
          />
        </div>
        {loading && <p className="text-center text-gray-300">Cargando...</p>}
        {error && <p className="text-center text-red-500">Error: {error.message}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 px-20">
          {filtered.map(p => (
            <Link key={p.id} to={`/product/${p.id}`}>
              <ProductCard {...p} />
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/product/125832031"
            onClick={scrollToCatalog}
            className="relative overflow-hidden px-8 py-3 bg-white text-black hover:bg-red-700 hover:text-white text-lg font-semibold group z-0 duration-300"
          >
            <span className="relative z-10 ">Ver Más Productos →</span>
          </Link>
        </div>
      </main>
    </div>
  );
};
