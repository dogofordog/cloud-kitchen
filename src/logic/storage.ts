import { getItem, setItem } from "../data/localStorage";
import type { CartItem } from "./cart";

export function loadCart(): CartItem[] {
  const cartItems = getItem<CartItem[]>("cart-items");
  return Array.isArray(cartItems) ? cartItems : [];
}

export function saveCart(items: CartItem[]): void {
  setItem<CartItem[]>("cart-items", items);
}
