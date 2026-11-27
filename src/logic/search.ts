import type { Product } from "../productTypes";

const normalize = (str: string) =>
  str.toLowerCase().replaceAll("ё", "е").replaceAll("-", " ").trim();

export function search(products: Product[], query: string = ""): Product[] {
  if (!query) return products;
  const normalizedString = normalize(query);
  return products.filter((product) => {
    const searchTerms = normalizedString.toLowerCase().split(/\s+/);
    const searchableText: string = [product.name, product.ingredients, ...product.tags]
      .map((text: string) => normalize(text))
      .join(" ")
      .toLowerCase();
    return searchTerms?.every((term) => searchableText.includes(term));
  });
}
