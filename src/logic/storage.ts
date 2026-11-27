import { getItem, setItem } from "../data/localStorage";
import type { CartItem } from "./cart";

export function loadCart(): CartItem[] {
  throw new Error();
}

export function saveCart(items: CartItem[]): void {
  throw new Error();
}
