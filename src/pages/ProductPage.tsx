// src/pages/ProductPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchProduct, fetchRelated } from '../api/products';
import type { SimplifiedProduct } from '../api/types';
import { formatPrice } from '../utils/format';
import { useFetch } from '../hooks/useFetch';
import { useCartStore } from '../stores/useCartStore';
import { ProductCard } from '../components/ProductCard';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productsRef = useRef<HTMLDivElement>(null);

  const [product, setProduct] = useState<SimplifiedProduct | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState<SimplifiedProduct[]>([]);

  const { loading, error, run } = useFetch(async () => {
    if (!id) return;
    const p = await fetchProduct(id);
    const r = await fetchRelated('tenis', 8);
    setProduct(p);
    setMainImage(p.images[0]);
    setRelated(r);
    if (p.sizes.length) setSelectedSize(p.sizes[0]);
    if (p.colors.length) setSelectedColor(p.colors[0]);
  });

  const addItem = useCartStore(s => s.addItem);

  useEffect(() => { run(); }, [id]);

  if (loading) return (
    <div className="flex flex-col md:flex-row gap-10 items-center justify-center min-h-[60vh]">
      <div className="size-40 bg-gray-500 animate-pulse" />
      <div className="flex flex-col gap-5">
        <div className="w-80 sm:w-100 h-4 bg-gray-500 animate-pulse rounded" />
        <div className="w-50 h-4 bg-gray-500 animate-pulse rounded" />
        <div className="flex flex-col gap-2">
          <div className="w-80 sm:w-100 h-2 bg-gray-500 animate-pulse rounded" />
          <div className="w-80 sm:w-100 h-2 bg-gray-500 animate-pulse rounded" />
          <div className="w-80 sm:w-100 h-2 bg-gray-500 animate-pulse rounded" />
          <div className="w-80 sm:w-100 h-2 bg-gray-500 animate-pulse rounded" />
        </div>
        <div className="w-20 h-2 bg-gray-500 animate-pulse rounded" />
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col gap-10 items-center justify-center min-h-[60vh]">
      <p className="text-lg text-red-500">Error: {error.message}</p>
      <img src="/monkey-svgrepo-com.svg" className="size-40" alt="" />
    </div>
  );


  if (!product) return (
    <div className="flex flex-col gap-10 items-center justify-center min-h-[60vh]">
      <p className="text-lg">Producto no encontrado</p>
      <img src="/monkey-svgrepo-com.svg" className="size-40" alt="" />
    </div>
  );

  const handleAdd = () => {
    addItem({ ...product, quantity, selectedSize, selectedColor });
    scrollToCatalog()
  };

  const scrollToCatalog = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const carouselSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className="container py-20 px-20" ref={productsRef}>
      {/* Galería de imágenes con thumbnails clicables */}
      <div className="grid md:grid-cols-2 gap-10 mb-12">
        <div>
          <img
            src={mainImage}
            alt={product.title}
            className="w-full mb-4 object-cover max-h-96"
          />
          <div className="flex flex-wrap space-x-2 space-y-2">
            {product.images.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`${product.title} ${idx}`}
                onClick={() => setMainImage(src)}
                className={`w-20 h-20 object-cover cursor-pointer transition-opacity duration-200 ${mainImage === src ? 'opacity-100 border-2 border-blue-600' : 'opacity-60'}`}
              />
            ))}
          </div>
        </div>

        {/* Detalles y Carrito */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">Marca: {product.brand} | SKU: {product.sku}</p>
          <p className="mb-6 text-gray-400 text-justify">{product.description}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={selectedSize}
              onChange={e => setSelectedSize(e.target.value)}
              className="border p-2 "
            >
              {product.sizes.map(sz => <option className='text-black' key={sz}>{sz}</option>)}
            </select>
            <select
              value={selectedColor}
              onChange={e => setSelectedColor(e.target.value)}
              className="border p-2"
            >
              {product.colors.map(c => <option className='text-black' key={c}>{c}</option>)}
            </select>
            <input
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="w-20 border p-2"
            />
          </div>

          <div className="flex items-baseline space-x-2 mb-6">
            {product.discountPrice ? (
              <>
                <span className="text-gray-500 line-through">{formatPrice(product.price)}</span>
                <span className="text-red-600 text-2xl font-semibold">{formatPrice(product.discountPrice)}</span>
              </>
            ) : (
              <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="btn-fill-from-bottom relative overflow-hidden px-8 py-3 bg-white text-black text-lg font-semibold group z-0 w-full"
          >
            <span className="relative z-10">Agregar al carrito</span>
          </button>
        </div>
      </div>

      {/* Sección de Beneficios */}
      <section className="mt-14 mb-10 bg-gray-100 p-6 md:p-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">¿Por qué te encantará este producto?</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <img src="https://img.icons8.com/ios-filled/50/000000/delivery.png" alt="Diseño" className="mx-auto mb-2 h-10" />
            <h3 className="font-semibold text-lg mb-1 text-gray-700">Diseño exclusivo</h3>
            <p className="text-gray-600 text-sm">Cada par está pensado para estilo y comodidad únicos.</p>
          </div>
          <div className="p-4">
            <img src="https://img.icons8.com/ios-filled/50/000000/return-purchase.png" alt="Devolución" className="mx-auto mb-2 h-10" />
            <h3 className="font-semibold text-lg mb-1 text-gray-700">Devoluciones sin estrés</h3>
            <p className="text-gray-600 text-sm">Tienes hasta 30 días para hacer cambios sin complicaciones.</p>
          </div>
          <div className="p-4">
            <img src="https://img.icons8.com/ios-filled/50/000000/delivery.png" alt="Envío" className="mx-auto mb-2 h-10" />
            <h3 className="font-semibold text-lg mb-1 text-gray-700">Envío rápido y gratis</h3>
            <p className="text-gray-600 text-sm">Recíbelo en tu casa sin costo adicional en pedidos desde $100.000.</p>
          </div>
        </div>
      </section>

      {/* Productos Relacionados con Carrusel */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Productos Relacionados</h2>
        <Slider {...carouselSettings}>
          {related.map(r => (
            <div key={r.id} className="px-2">
              <Link to={`/product/${r.id}`} onClick={() => scrollToCatalog()}>
                <ProductCard {...r} />
              </Link>
            </div>
          ))}
        </Slider>
      </section>
    </div>

  );
};
