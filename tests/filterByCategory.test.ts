import { describe, expect, it } from 'vitest';
import { filterByCategory } from '../src/logic/filter';
import type { CategoryName, Product } from '../src/productTypes';

const createMockProduct = (id: Product['id'], category: CategoryName, qty = 10): Product => ({
  id,
  category,
  name: `Блюдо ${id}`,
  description: 'Описание',
  ingredients: 'Состав',
  weight: 300,
  price: 350,
  calories: 150,
  protein: 10,
  fat: 5,
  carbs: 15,
  tags: [],
  qty,
  image: '01.png',
});

describe('filter (фильтрация по категориям)', () => {
  const MOCK_PRODUCTS: Product[] = [
    createMockProduct('brk-01', 'Завтраки'),
    createMockProduct('brk-02', 'Завтраки'),
    createMockProduct('lnc-01', 'Обеды'),
    createMockProduct('din-01', 'Ужины'),
    createMockProduct('snk-01', 'Перекусы', 0),
  ];

  it('возвращает исходный массив без изменений, если фильтра нет', () => {
    const result = filterByCategory(MOCK_PRODUCTS);

    expect(result).toBe(MOCK_PRODUCTS);
    expect(result).toHaveLength(5);
  });

  it('возвращает все блюда выбранной категории (несколько совпадений)', () => {
    const result = filterByCategory(MOCK_PRODUCTS, 'Завтраки');

    expect(result).toHaveLength(2);
    expect(result.map((p) => p.id)).toEqual(['brk-01', 'brk-02']);
  });

  it('сохраняет исходный порядок блюд внутри отфильтрованной категории', () => {
    const result = filterByCategory(MOCK_PRODUCTS, 'Завтраки');

    expect(result).toEqual([MOCK_PRODUCTS[0], MOCK_PRODUCTS[1]]);
  });

  it('не отбрасывает товары с нулевым остатком (qty === 0) внутри категории', () => {
    const result: Product[] = filterByCategory(MOCK_PRODUCTS, 'Перекусы');

    expect(result).toHaveLength(1);
    expect(result.map((p) => p.id)).toEqual(['snk-01']);
  });

  it('возвращает пустой массив, если в каталоге нет блюд выбранной категории', () => {
    const result = filterByCategory(MOCK_PRODUCTS, 'Десерты');

    expect(result).toEqual([]);
  });

  it('не мутирует исходный массив товаров', () => {
    const snapshot = [...MOCK_PRODUCTS];

    const result = filterByCategory(MOCK_PRODUCTS, 'Обеды');

    expect(result).not.toBe(MOCK_PRODUCTS);
    expect(MOCK_PRODUCTS).toEqual(snapshot);
  });

  it('корректно работает с пустым массивом товаров', () => {
    expect(filterByCategory([], 'Обеды')).toEqual([]);
    expect(filterByCategory([])).toEqual([]);
  });
});
