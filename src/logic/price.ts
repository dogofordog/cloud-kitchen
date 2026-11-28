import type { Product } from "../productTypes";
export function filterByPrice(
  products: Product[],
  from: number | null = null,
  to: number | null = null,
): Product[] {
  const min = from !== null && Number.isFinite(from) ? from : null;
  const max = to !== null && Number.isFinite(to) ? to : null;

  return products.filter((product) => {
    if (min !== null && product.price < min) return false;
    if (max !== null && product.price > max) return false;
    return true;
  });
}
