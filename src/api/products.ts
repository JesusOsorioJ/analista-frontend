import type { RawProduct, SimplifiedProduct } from './types';
import dataJson from '../../data.json'
const data: RawProduct[] = dataJson as RawProduct[];

const BASE = 'https://api-frontend-production.up.railway.app/api';

export async function fetchRawProduct(id: string): Promise<RawProduct> {
// Se comenta esto debido a que se envia mucha informacion en cada registro,
// lo busco desde data.json para mejorar rendimiento de aplicacion 
// const res = await fetch(`${BASE}/products/${id}`);
// if (!res.ok) throw new Error(`Error fetching product ${id}: ${res.status}`);
  const product = data.find(d => d.productId === id);
  if (!product) {
    throw new Error(`Product with id ${id} not found`);
  }
  return product;
}

export async function fetchRawRelated(ft: string): Promise<RawProduct[]> {
// Se comenta esto debido a que se envia mucha informacion en cada registro,
// lo busco desde data.json para mejorar rendimiento de aplicacion 
//   const res = await fetch(`${BASE}/products?ft=${ft}`);
//   if (!res.ok) throw new Error(`Error fetching related products: ${res.status}`);
//   return res.json();
  return data;
}

export function transformProduct(raw: RawProduct): SimplifiedProduct {
  const firstItem = raw.items[0];
  const offer = firstItem.sellers[0].commertialOffer;
  const colors = raw.skuSpecifications.find(s => s.field.name === 'Color')?.values.map(v => v.name) ?? firstItem.Color;
  const sizes = raw.skuSpecifications.find(s => s.field.name === 'Talla')?.values.map(v => v.name) ?? firstItem.Talla;
  return {
    id: raw.productId,
    title: raw.productName,
    brand: raw.brand,
    sku: raw.productReferenceCode,
    description: raw.description,
    images: firstItem.images.map(i => i.imageUrl),
    colors,
    sizes,
    price: offer.ListPrice,
    discountPrice: offer.PriceWithoutDiscount < offer.ListPrice ? offer.Price : undefined,
    available: offer.IsAvailable,
  };
}

export async function fetchProduct(id: string): Promise<SimplifiedProduct> {
  const raw = await fetchRawProduct(id);
  return transformProduct(raw);
}

export async function fetchRelated(ft: string, limit = 4): Promise<SimplifiedProduct[]> {
  const raws = await fetchRawRelated(ft);
  return raws.slice(0, limit).map(transformProduct);
}
