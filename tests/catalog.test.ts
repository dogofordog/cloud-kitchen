import { describe, it, expect } from "vitest";
import { filterProducts, DEFAULT_FILTERS } from "../src/logic/catalog";
import type { Product } from "../src/productTypes";
import productsData from "../src/data/products.json";

const catalog = productsData as Product[];
const ids = (list: Product[]) => list.map((p) => p.id);

describe("filterProducts", () => {
  it("пустые фильтры возвращают все 24 блюда новым массивом", () => {
    const result = filterProducts(catalog, DEFAULT_FILTERS);
    expect(result).toHaveLength(24);
    expect(result).not.toBe(catalog);
    expect(ids(result)).toEqual(ids(catalog));
  });
  it("поиск «лосос» даёт 2 блюда", () => {
    expect(
      ids(filterProducts(catalog, { ...DEFAULT_FILTERS, search: "лосос" })),
    ).toEqual(["brk-03", "lnc-02"]);
  });
  it("поиск + категория сужают до 1", () => {
    expect(
      ids(
        filterProducts(catalog, {
          ...DEFAULT_FILTERS,
          search: "лосос",
          category: "Завтраки",
        }),
      ),
    ).toEqual(["brk-03"]);
  });
  it("регистр не важен: «ХИТ» даёт 7", () => {
    expect(
      filterProducts(catalog, { ...DEFAULT_FILTERS, search: "ХИТ" }),
    ).toHaveLength(7);
  });
  it("запрос только из пробелов возвращает все", () => {
    expect(
      filterProducts(catalog, { ...DEFAULT_FILTERS, search: "   " }),
    ).toHaveLength(24);
  });
  it("несуществующий запрос даёт пустой список", () => {
    expect(
      filterProducts(catalog, { ...DEFAULT_FILTERS, search: "несуществующее" }),
    ).toEqual([]);
  });
  it("категория «Завтраки» даёт 4 блюда", () => {
    expect(
      filterProducts(catalog, { ...DEFAULT_FILTERS, category: "Завтраки" }),
    ).toHaveLength(4);
  });
  it("сортировка по возрастанию ставит первым brk-02", () => {
    expect(
      ids(
        filterProducts(catalog, { ...DEFAULT_FILTERS, sort: "price-asc" }),
      )[0],
    ).toBe("brk-02");
  });
  it("сортировка по убыванию ставит первым lnc-01", () => {
    expect(
      ids(
        filterProducts(catalog, { ...DEFAULT_FILTERS, sort: "price-desc" }),
      )[0],
    ).toBe("lnc-01");
  });
  it("сортировка применяется к отфильтрованному списку", () => {
    expect(
      ids(
        filterProducts(catalog, {
          ...DEFAULT_FILTERS,
          category: "Завтраки",
          sort: "price-asc",
        }),
      ),
    ).toEqual(["brk-02", "brk-01", "brk-04", "brk-03"]);
  });
  it("границы цены включительные: 300–400 дают 8 блюд", () => {
    expect(
      filterProducts(catalog, {
        ...DEFAULT_FILTERS,
        priceFrom: 300,
        priceTo: 400,
      }),
    ).toHaveLength(8);
  });
  it("если нижняя граница выше верхней, результат пустой", () => {
    expect(
      filterProducts(catalog, {
        ...DEFAULT_FILTERS,
        priceFrom: 600,
        priceTo: 300,
      }),
    ).toEqual([]);
  });
  it("не мутирует исходный массив", () => {
    const before = ids(catalog);
    filterProducts(catalog, {
      ...DEFAULT_FILTERS,
      sort: "price-desc",
      search: "хит",
    });
    expect(ids(catalog)).toEqual(before);
  });
});
