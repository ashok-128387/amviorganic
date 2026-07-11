import { Product, ProductVariation } from './mock-data';

export function getVariationStock(product: Product, variationId: string): number {
  return product.variations.find(v => v.id === variationId)?.stock ?? 0;
}

export function getTotalStock(product: Product): number {
  return product.variations.reduce((sum, v) => sum + (v.stock ?? 0), 0);
}

export function isVariationOutOfStock(product: Product, variationId: string): boolean {
  return getVariationStock(product, variationId) <= 0;
}

export function isProductOutOfStock(product: Product): boolean {
  return getTotalStock(product) <= 0;
}

export function getStockLabel(product: Product, variationId?: string): string {
  if (isProductOutOfStock(product)) return 'Out of Stock';
  if (variationId) {
    const stock = getVariationStock(product, variationId);
    if (stock <= 0) return 'Out of Stock';
    if (stock < 10) return `Only ${stock} left`;
  }
  return 'In Stock';
}
