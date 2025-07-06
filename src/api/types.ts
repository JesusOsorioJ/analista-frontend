// Estructura de datos de productos
export interface RawProduct {
  productId: string;
  productName: string;
  brand: string;
  brandId: number;
  brandImageUrl: string | null;
  linkText: string;
  productReference: string;
  productReferenceCode: string;
  categoryId: string;
  productTitle: string;
  metaTagDescription: string;
  releaseDate: string;
  clusterHighlights: Record<string, unknown>;
  productClusters: Record<string, string>;
  searchableClusters: Record<string, string>;
  categories: string[];
  categoriesIds: string[];
  link: string;
  ZAPATOS: string[];
  meli_shipping_mode: string[];
  Modelo: string[];
  Impuesto: string[];
  Genero: string[];
  meli_title: string[];
  "REGISTRO SIC": string[];
  General: string[];
  "ALTO (cm)": string[];
  "INSTRUCCIONES DE CUIDADO": string[];
  "PAÍS DE ORIGEN": string[];
  "PESO (gr)": string[];
  CARACTERÍSTICAS: string[];
  "FABRICANTE Y/O IMPORTADOR": string[];
  "ANCHO (cm)": string[];
  "PROFUNDO/LONGITUD (cm)": string[];
  COMPOSICIÓN: string[];
  Contenido: string[];
  allSpecifications: string[];
  allSpecificationsGroups: string[];
  description: string;
  items: Item[];
  skuSpecifications: SkuSpecification[];
}

export interface Item {
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  ean: string;
  referenceId: ReferenceId[];
  measurementUnit: string;
  unitMultiplier: number;
  modalType: string | null;
  isKit: boolean;
  images: Image[];
  Color: string[];
  Talla: string[];
  variations: string[];
  sellers: Seller[];
  Videos: unknown[];
  estimatedDateArrival: string | null;
}

export interface ReferenceId {
  Key: string;
  Value: string;
}

export interface Image {
  imageId: string;
  imageLabel: string;
  imageTag: string;
  imageUrl: string;
  imageText: string;
  imageLastModified: string;
}

export interface Seller {
  sellerId: string;
  sellerName: string;
  addToCartLink: string;
  sellerDefault: boolean;
  commertialOffer: CommertialOffer;
}

export interface CommertialOffer {
  DeliverySlaSamplesPerRegion: Record<string, unknown>;
  Installments: unknown[];
  DiscountHighLight: unknown[];
  GiftSkuIds: unknown[];
  Teasers: unknown[];
  PromotionTeasers: unknown[];
  BuyTogether: unknown[];
  ItemMetadataAttachment: unknown[];
  Price: number;
  ListPrice: number;
  PriceWithoutDiscount: number;
  FullSellingPrice: number;
  RewardValue: number;
  PriceValidUntil: string;
  AvailableQuantity: number;
  IsAvailable: boolean;
  Tax: number;
  DeliverySlaSamples: unknown[];
  GetInfoErrorMessage: string;
  CacheVersionUsedToCallCheckout: string;
  PaymentOptions: PaymentOptions;
}

export interface PaymentOptions {
  installmentOptions: unknown[];
  paymentSystems: unknown[];
  payments: unknown[];
  giftCards: unknown[];
  giftCardMessages: unknown[];
  availableAccounts: unknown[];
  availableTokens: unknown[];
}

export interface SkuSpecification {
  field: Field;
  values: SkuValue[];
}

export interface Field {
  id: number;
  name: string;
  isActive: boolean;
  position: number;
  type: string;
}

export interface SkuValue {
  id: string;
  name: string;
  position: number;
}

// The top-level JSON is an array of RawProduct
export type ProductsData = RawProduct[];

export interface SimplifiedProduct {
  id: string;
  title: string;
  brand: string;
  sku: string;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  price: number;
  discountPrice?: number;
  available: boolean;
}