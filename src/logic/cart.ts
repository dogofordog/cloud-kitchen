export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export const PROMO_CODE = "SALE10";
export const PROMO_DISCOUNT = 0.1;

export function addToCart(items: CartItem[], product: CartProduct): CartItem[] {
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    return items.map((item) =>
      item.id === product.id
        ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
        : item,
    );
  }

  if (product.qty <= 0) return items;

  return [
    ...items,
    {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.qty,
    },
  ];
}

export function increaseQuantity(items: CartItem[], id: string): CartItem[] {
  return items.map((item) =>
    item.id === id
      ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
      : item,
  );
}

export function decreaseQuantity(items: CartItem[], id: string): CartItem[] {
  return items.map((item) =>
    item.id === id
      ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
      : item,
  );
}

export function removeItem(items: CartItem[], id: string): CartItem[] {
  return items.filter((item) => item.id !== id);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function calculateCartTotal(items: CartItem[], promoCode = ""): number {
  if (items.length === 0) return 0;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const code = promoCode.trim().toUpperCase();
  const discount = code === PROMO_CODE ? PROMO_DISCOUNT : 0;

  return Math.round(subtotal * (1 - discount) * 100) / 100;
}
