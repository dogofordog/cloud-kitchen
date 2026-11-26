import { describe, it, expect } from "vitest";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  getCartCount,
  calculateCartTotal,
} from "../src/logic/cart";
import type { CartItem, CartProduct } from "../src/logic/cart";

const line = (price: number, quantity: number, stock = 10): CartItem => ({
  id: "brk-01",
  name: "Сырники",
  price,
  quantity,
  stock,
});

const product = (qty: number): CartProduct => ({
  id: "brk-01",
  name: "Сырники",
  price: 330,
  qty,
});

describe("calculateCartTotal", () => {
  it("пустая корзина → 0", () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  it("одна позиция: 330 × 2 = 660", () => {
    expect(calculateCartTotal([line(330, 2)])).toBe(660);
  });

  it("суммирует несколько позиций", () => {
    expect(calculateCartTotal([line(330, 2), line(260, 1)])).toBe(920);
  });

  it("SALE10 даёт 10%: 660 → 594", () => {
    expect(calculateCartTotal([line(330, 2)], "SALE10")).toBe(594);
  });

  it("регистр и пробелы в промокоде не важны", () => {
    expect(calculateCartTotal([line(330, 2)], "  sale10 ")).toBe(594);
  });

  it("неизвестный промокод не даёт скидку", () => {
    expect(calculateCartTotal([line(330, 2)], "WRONG")).toBe(660);
  });

  it("округляет до копеек", () => {
    expect(calculateCartTotal([line(299.99, 2)], "SALE10")).toBe(539.98);
  });
});

describe("addToCart", () => {
  it("новое блюдо → количество 1", () => {
    const cart = addToCart([], product(10));
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(1);
  });

  it("повторное добавление увеличивает количество, а не создаёт строку", () => {
    const cart = addToCart(addToCart([], product(10)), product(10));
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  it("не превышает остаток stock", () => {
    const cart = addToCart([line(330, 10, 10)], product(10));
    expect(cart[0].quantity).toBe(10);
  });

  it("блюдо с qty = 0 не добавляется", () => {
    expect(addToCart([], product(0))).toHaveLength(0);
  });
});

describe("изменение количества и удаление", () => {
  it("increaseQuantity не выше остатка", () => {
    expect(increaseQuantity([line(330, 10, 10)], "brk-01")[0].quantity).toBe(
      10,
    );
  });

  it("decreaseQuantity не ниже 1", () => {
    expect(decreaseQuantity([line(330, 1)], "brk-01")[0].quantity).toBe(1);
  });

  it("removeItem убирает позицию", () => {
    expect(removeItem([line(330, 2)], "brk-01")).toHaveLength(0);
  });

  it("getCartCount считает все товары", () => {
    expect(getCartCount([line(330, 2), line(260, 1)])).toBe(3);
  });
});
