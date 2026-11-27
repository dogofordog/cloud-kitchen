import type { CategoryName, Product } from "../productTypes";

export function filterByCategory(products: Product[], category?: CategoryName): Product[] {
  if (!category) return products;
  return products.filter((product) => product.category === category);
}
