import React from 'react';
import type { SimplifiedProduct } from '../api/types';
import { formatPrice } from '../utils/format';

export const ProductCard: React.FC<SimplifiedProduct> = ({
  id,
  title,
  images,
  price,
  discountPrice,
}) => {
  return (
    <div className="relative bg-[#00000057] overflow-hidden shadow-md group transition-transform duration-300 hover:scale-[1.015]">
      <img
        src={images[0]}
        alt={title + id}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="p-4">
        <h3 className="text-white text-base font-medium line-clamp-2">{title}</h3>

        <div className="mt-2">
          {discountPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 line-through">{formatPrice(price)}</span>
              <span className="text-red-500 text-base font-bold">{formatPrice(discountPrice)}</span>
            </div>
          ) : (
            <span className="text-white text-base font-bold">{formatPrice(price)}</span>
          )}
        </div>
      </div>

      <div
        // to={`/product/${id}`}
        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition duration-300 bg-white text-black text-sm px-4 py-1.5 shadow hover:bg-gray-200"
      >
        Ver más
      </div>
    </div>
  );
};
