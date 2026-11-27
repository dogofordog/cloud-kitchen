import { describe, expect, it } from 'vitest';
import { sortByPrice } from '../src/logic/sort';
import type { Product } from '../src/productTypes';

const createMockProduct = (id: Product['id'], price: number, qty: number): Product => ({
  id,
  category: 'Обеды',
  name: `Блюдо ${id}`,
  description: 'Описание',
  ingredients: 'Состав',
  weight: 300,
  price,
  calories: 150,
  protein: 10,
  fat: 5,
  carbs: 15,
  tags: [],
  qty,
  image: '01.png',
});

describe('sortByPrice (сортировка по цене с учетом наличия)', () => {
  const MOCK_PRODUCTS: Product[] = [
    createMockProduct('brk-01', 330, 10),
    createMockProduct('lnc-05', 200, 0),
    createMockProduct('lnc-02', 590, 5),
    createMockProduct('din-04', 420, 0),
  ];

  it('возвращает исходный массив без изменений, если direction не передан', () => {
    const result = sortByPrice(MOCK_PRODUCTS);

    expect(result).toBe(MOCK_PRODUCTS);
    expect(result.map((p) => p.id)).toEqual(['brk-01', 'lnc-05', 'lnc-02', 'din-04']);
  });

  it('сортирует по возрастанию цены (asc), но опускает товары с qty === 0 в самый низ', () => {
    const result = sortByPrice(MOCK_PRODUCTS, 'asc');
    expect(result.map((p) => p.id)).toEqual([
      'brk-01', // price: 330, qty: 10
      'lnc-02', // price: 590, qty: 5
      'lnc-05', // price: 200, qty: 0
      'din-04', // price: 420, qty: 0
    ]);
  });

  it('сортирует по убыванию цены (desc), но держит товары с qty === 0 в самом низу', () => {
    const result = sortByPrice(MOCK_PRODUCTS, 'desc');
    expect(result.map((p) => p.id)).toEqual([
      'lnc-02', // price: 590, qty: 5
      'brk-01', // price: 330, qty: 10
      'din-04', // price: 420, qty: 0
      'lnc-05', // price: 200, qty: 0
    ]);
  });

  it('сохраняет относительный порядок товаров с одинаковой ценой и статусом наличия', () => {
    const samePriceProducts: Product[] = [
      createMockProduct('brk-01', 300, 5),
      createMockProduct('brk-02', 300, 2),
      createMockProduct('din-01', 300, 0),
      createMockProduct('din-02', 300, 0),
    ];

    const result = sortByPrice(samePriceProducts, 'asc');

    expect(result.map((p) => p.id)).toEqual(['brk-01', 'brk-02', 'din-01', 'din-02']);
  });

  it('не мутирует исходный массив при сортировке', () => {
    const originalOrder = MOCK_PRODUCTS.map((p) => p.id);

    const result = sortByPrice(MOCK_PRODUCTS, 'desc');

    expect(result).not.toBe(MOCK_PRODUCTS);
    expect(MOCK_PRODUCTS.map((p) => p.id)).toEqual(originalOrder);
  });

  it('корректно обрабатывает пустой массив', () => {
    expect(sortByPrice([], 'asc')).toEqual([]);
    expect(sortByPrice([], 'desc')).toEqual([]);
    expect(sortByPrice([])).toEqual([]);
  });
});
