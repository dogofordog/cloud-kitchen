export type CategoryPrefix = 'brk' | 'lnc' | 'din' | 'snk' | 'dst';

export type CategoryName = 'Завтраки' | 'Обеды' | 'Ужины' | 'Перекусы' | 'Десерты';

export type ProductId = `${CategoryPrefix}-${string}`;

export type ProductTag =
  | 'Хит'
  | 'Новинка'
  | 'Веган'
  | 'Вегетарианское'
  | 'Без лактозы'
  | 'Без глютена'
  | 'Без сахара'
  | 'Много белка'
  | 'Фитнес'
  | 'Низкокалорийное'
  | 'Завтрак весь день'
  | 'Удобно с собой'
  | 'Выгодно'
  | 'Комбо'
  | 'Обед'
  | 'Сытно'
  | 'Острое'
  | 'Классика';

export type SortDirection = 'asc' | 'desc';

export interface Product {
  id: ProductId;
  category: CategoryName;
  name: string;
  description: string;
  ingredients: string;
  weight: number;
  price: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  tags: ProductTag[];
  qty: number;
  image: string;
}
