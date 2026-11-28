import { describe, expect, it } from 'vitest';
import { search } from '../src/logic/search';

import type { Product } from '../src/productTypes';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'brk-01',
    category: 'Завтраки',
    name: 'Сырники из фермерского творога',
    description: 'Нежные запеченные сырники со сметаной',
    ingredients: 'Творог 5%, яйцо, мука рисовая, малина',
    weight: 210,
    price: 330,
    calories: 195,
    protein: 13.8,
    fat: 7.4,
    carbs: 18.3,
    tags: ['Хит', 'Завтрак весь день'],
    qty: 10,
    image: '01.png',
  },
  {
    id: 'lnc-02',
    category: 'Обеды',
    name: 'Боул с лососем терияки и авокадо',
    description: 'Запеченный лосось, киноа и спелый авокадо',
    ingredients: 'Лосось, киноа, авокадо хасс, бобы эдамаме, соль',
    weight: 340,
    price: 590,
    calories: 165,
    protein: 9.2,
    fat: 8.4,
    carbs: 13.1,
    tags: ['Хит', 'Много белка'],
    qty: 5,
    image: '06.png',
  },
  {
    id: 'din-04',
    category: 'Ужины',
    name: 'Зеленый боул с тофу и брокколи',
    description: 'Растительный сбалансированный ужин',
    ingredients: 'Сыр тофу, брокколи, гречка зеленая, гуакамоле',
    weight: 330,
    price: 420,
    calories: 128,
    protein: 6.8,
    fat: 6.1,
    carbs: 11.5,
    tags: ['Веган', 'Без лактозы'],
    qty: 0,
    image: '14.png',
  },
];

describe('search (поиск по каталогу)', () => {
  it('возвращает все товары при пустой строке или пробелах', () => {
    expect(search(MOCK_PRODUCTS, '')).toHaveLength(3);
    expect(search(MOCK_PRODUCTS, '    ')).toHaveLength(3);
  });

  it('ищет по названию без учета регистра', () => {
    const result = search(MOCK_PRODUCTS, 'СЫРНИКИ');
    expect(result.map((p) => p.id)).toEqual(['brk-01']);
  });

  it('ищет по составу (ingredients)', () => {
    const result = search(MOCK_PRODUCTS, 'эдамаме');
    expect(result.map((p) => p.id)).toEqual(['lnc-02']);
  });

  it('ищет по тегам', () => {
    const result = search(MOCK_PRODUCTS, 'веган');
    expect(result.map((p) => p.id)).toEqual(['din-04']);
  });

  it('находит товар по нескольким словам в произвольном порядке из разных полей', () => {
    const result = search(MOCK_PRODUCTS, 'гречка боул');
    expect(result.map((p) => p.id)).toEqual(['din-04']);
  });

  it('возвращает пустой массив при отсутствии совпадений', () => {
    const result = search(MOCK_PRODUCTS, 'шаурма');
    expect(result).toEqual([]);
  });

  it('находит несколько товаров по общей части слова в названии', () => {
    const result = search(MOCK_PRODUCTS, 'боул');

    expect(result).toHaveLength(2);
    expect(result.map((p) => p.id)).toEqual(['lnc-02', 'din-04']);
  });

  it('находит несколько товаров по общему ингредиенту в составе (даже в разных падежах)', () => {
    const result = search(MOCK_PRODUCTS, 'сыр');

    expect(result).toHaveLength(2);
    expect(result.map((p) => p.id)).toEqual(['brk-01', 'din-04']);
  });

  it('находит несколько товаров по короткой подстроке из разных полей', () => {
    const result = search(MOCK_PRODUCTS, 'ол');

    expect(result).toHaveLength(2);
    expect(result.map((p) => p.id)).toEqual(['lnc-02', 'din-04']);
  });

  it('игнорирует разницу между "е" и "ё", а также дефисы', () => {
    const productsWithYo: Product[] = [
      {
        ...MOCK_PRODUCTS[0],
        id: 'din-01',
        name: 'Боул с печёным бататом',
      },
      {
        ...MOCK_PRODUCTS[1],
        id: 'din-03',
        name: 'Индейка с печёным перцем',
      },
    ];

    const result = search(productsWithYo, 'пёчен');

    expect(result).toHaveLength(2);
    expect(result.map((p) => p.id)).toEqual(['din-01', 'din-03']);
  });

  it('игнорирует дефисы', () => {
    const productsWithHyphen: Product[] = [
      {
        ...MOCK_PRODUCTS[0],
        id: 'din-01',
        name: 'Фреш-крем-суп',
      },
      {
        ...MOCK_PRODUCTS[1],
        id: 'din-03',
        name: 'Фреш крем-суп',
      },

      {
        ...MOCK_PRODUCTS[2],
        id: 'din-04',
        name: 'Фреш крем суп',
      },
    ];

    const result = search(productsWithHyphen, 'крем суп фреш');

    expect(result).toHaveLength(3);
    expect(result.map((p) => p.id)).toEqual(['din-01', 'din-03', 'din-04']);
  });
});
