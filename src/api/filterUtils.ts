import rawProductTypes from './types.ts?raw';
import type { RawProduct } from './types';
// import type { RawProduct } from './jsonTypes';
export const typeDefs = rawProductTypes as string;

/**
 * Construye un prompt pasando **solo** las definiciones de tipo de tu JSON (sin datos)
 * para que la IA sugiera los campos por los que filtrar según la consulta del usuario.
 */
export function buildFilterPromptFromTypes(userQuery: string): string {
  // Extrae aquí manualmente (o mediante script) las propiedades principales y anidadas de RawProduct.
 

  return `
    Tienes estas definiciones de tipo de producto (TypeScript):
    ${typeDefs}

    El usuario pide:
    "${userQuery}"

    Basándote únicamente en los **nombres de campo** y **tipos** arriba, indícame **exactamente** qué claves del objeto RawProduct usar para filtrar la lista de productos.
    Devuélveme un objeto con clave: valor de filtro.
    Por ejemplo:
    {
      "productName": "Polo",
      "skuSpecifications.field.name": "Color",
      "skuSpecifications.values": "Rojo"
    }

    Solo incluye las propiedades necesarias para satisfacer la solicitud del usuario. ENFASIS solo regresa el objeto con claves: valor de filtro nada mas`;
}


/**
 * Filtra un arreglo de RawProduct según un objeto de filtros.
 * Soporta claves planas, arrays de strings, y rutas dinámicas.
 * Para valores string, utiliza includes en lugar de igualdad estricta.
 *
 * @param data - Arreglo completo de productos raw
 * @param filters - Objeto de filtros devuelto por la IA, por ejemplo:
 *   { productName: 'Polo', 'skuSpecifications.field.name': 'Color', 'skuSpecifications.values': 'Rojo' }
 * @returns Lista de RawProduct que cumplen todos los filtros
 */
export function filterRawProducts1(
  data: RawProduct[],
  filters: Record<string, string | number>
) {
  function matchesFilter(obj: any, pathParts: string[], value: string | number): boolean {
    if (obj == null) return false;
    const [key, ...rest] = pathParts;
    if (!(key in obj)) return false;
    const prop = obj[key];
    if (rest.length === 0) {
      // nivel terminal: comparación
      if (Array.isArray(prop)) {
        return prop.some(item => {
          if (typeof item === 'string' && typeof value === 'string') {
            return item.toLowerCase().includes(value.toLowerCase());
          }
          return item === value;
        });
      }
      if (typeof prop === 'string' && typeof value === 'string') {
        return prop.toLowerCase().includes(value.toLowerCase());
      }
      return prop === value;
    }
    // descendemos en estructuras anidadas
    if (Array.isArray(prop)) {
      return prop.some(item => matchesFilter(item, rest, value));
    }
    if (typeof prop === 'object') {
      return matchesFilter(prop, rest, value);
    }
    return false;
  }

  return data.filter(product => {
    return Object.entries(filters).every(([key, value]) => {
      const pathParts = key.split('.');
      return matchesFilter(product, pathParts, value);
    });
  });
}


/**
 * Filtra un arreglo de RawProduct con prioridad y soporte a valores múltiples:
 * 1) Coincide con todas las propiedades (AND).
 * 2) Si no hay resultados, coincidencia con alguna propiedad (OR).
 * 3) Si aún no hay resultados, coincidencia parcial por palabra clave.
 *
 * @param data - Arreglo de RawProduct
 * @param filters - Objeto de filtros, donde el valor puede ser string, number o array de ellos.
 */
export function filterRawProducts(
  data: RawProduct[],
  filters: Record<string, string | number | Array<string | number>>
): RawProduct[] {
  // Genera funciones matcher que aceptan múltiples valores
  const matchers = Object.entries(filters).map(([key, value]) => {
    const path = key.split('.');
    const values = Array.isArray(value) ? value : [value];
    return (item: RawProduct) =>
      values.some(val => matchesFilter(item, path, val));
  });

  // 1) AND: todos los filtros
  let result = data.filter(item => matchers.every(fn => fn(item)));
  if (result.length) return result;

  // 2) OR: al menos uno
  result = data.filter(item => matchers.some(fn => fn(item)));
  if (result.length) return result;

  // 3) Palabras clave: divide strings en palabras
  const words = Object.values(filters)
    .flatMap(v => (Array.isArray(v) ? v : [v]))
    .filter(v => typeof v === 'string')
    .flatMap(v => (v as string).toLowerCase().split(/\s+/).filter(w => w));

  // Fallback de keywords
  return data
    .map(item => ({
      item,
      score: words.reduce((s, w) => s + keywordCount(item, w), 0)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

/**
 * Cuenta cuántas veces aparece la palabra en campos string/array de string.
 */
function keywordCount(obj: any, word: string): number {
  let count = 0;
  Object.values(obj).forEach(val => {
    if (typeof val === 'string') {
      count += (val.toLowerCase().match(new RegExp(word, 'g')) || []).length;
    } else if (Array.isArray(val)) {
      val.forEach(el => {
        if (typeof el === 'string') {
          count += (el.toLowerCase().match(new RegExp(word, 'g')) || []).length;
        }
      });
    }
  });
  return count;
}

/**
 * Recursiva para evaluar rutas dinámicas en el objeto.
 */
function matchesFilter(obj: any, pathParts: string[], value: string | number): boolean {
  if (obj == null) return false;
  const [key, ...rest] = pathParts;
  if (!(key in obj)) return false;
  const prop = obj[key];
  if (rest.length === 0) {
    if (Array.isArray(prop)) {
      return prop.some(item => compare(item, value));
    }
    return compare(prop, value);
  }
  if (Array.isArray(prop)) {
    return prop.some(item => matchesFilter(item, rest, value));
  }
  if (typeof prop === 'object') {
    return matchesFilter(prop, rest, value);
  }
  return false;
}

/**
 * Compara valores primitivos: includes para strings, equality para otros.
 */
function compare(prop: any, value: string | number): boolean {
  if (typeof prop === 'string' && typeof value === 'string') {
    return prop.toLowerCase().includes(value.toLowerCase());
  }
  return prop === value;
}



export function parseJsonFromMarkdown(response: string): unknown {
  // Elimina los backticks y la palabra 'json'
  const cleaned = response
    .replace(/```json\s*/, '')  // quita ```json al inicio
    .replace(/```$/, '')        // quita ``` al final
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`JSON inválido al parsear (contenido limpiado): ${cleaned}`);
  }
}