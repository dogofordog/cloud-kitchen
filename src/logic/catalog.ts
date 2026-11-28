import type { CategoryName, Product } from "../productTypes";
import { search } from "./search";
import { filterByCategory } from "./filter";
import { sortByPrice } from "./sort";
import { filterByPrice } from "./price";

export type SortOption = "default" | "price-asc" | "price-desc";

export interface CatalogFilters {
  search: string;
  category: string;
  priceFrom: number | null;
  priceTo: number | null;
  sort: SortOption;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  search: "",
  category: "all",
  priceFrom: null,
  priceTo: null,
  sort: "default",
};

export function filterProducts(
  products: Product[],
  filters: CatalogFilters,
): Product[] {
  const known = new Set(products.map((p) => p.category));
  const category = known.has(filters.category as CategoryName)
    ? (filters.category as CategoryName)
    : undefined;

  const direction =
    filters.sort === "price-asc"
      ? "asc"
      : filters.sort === "price-desc"
        ? "desc"
        : undefined;

  const searched = search(products, filters.search);
  const byCategory = filterByCategory(searched, category);
  const byPrice = filterByPrice(byCategory, filters.priceFrom, filters.priceTo);
  return sortByPrice(byPrice, direction);
}
