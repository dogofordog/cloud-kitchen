import type { Product, SortDirection } from '../productTypes';

export function sortByPrice(products: Product[], direction?: SortDirection): Product[] {
  if (!direction) return products;
  const multiplier = direction === 'asc' ? 1 : -1;

  return products.toSorted((a, b) => {
    const aInStock = a.qty > 0;
    const bInStock = b.qty > 0;

    // Товары в наличии всегда выше товаров с qty === 0
    if (aInStock !== bInStock) {
      return aInStock ? -1 : 1;
    }
    return (a.price - b.price) * multiplier;
  });
}
