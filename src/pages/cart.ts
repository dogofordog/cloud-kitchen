import productsData from "../data/products.json";
import type { Product } from "../productTypes";

import {
  calculateCartTotal,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  getCartCount,
  PROMO_CODE,
  type CartItem,
} from "../logic/cart";
import { loadCart, saveCart } from "../logic/storage";
import { getItem, setItem } from "../data/localStorage";

const catalog = productsData as Product[];

let cart: CartItem[] = loadCart();
let promo: string = getItem<string>("promo") ?? "";

const assetUrl = (path: string): string => `${import.meta.env.BASE_URL}${path}`;

const photoOf = (id: string): string => {
  const product = catalog.find((item) => item.id === id);
  const base = (product?.image ?? "").replace(/\.[^.]+$/, "");
  return assetUrl(`images/${base}.jpg`);
};

const isPromoValid = (): boolean => promo.trim().toUpperCase() === PROMO_CODE;

function updateBadge(): void {
  const badge = document.querySelector<HTMLElement>(".badge");
  if (!badge) return;
  const count = getCartCount(cart);
  badge.hidden = count === 0;
  badge.textContent = String(count);
}

function rowHtml(item: CartItem): string {
  return `
    <li class="cart-row" data-id="${item.id}">
      <img class="cart-row__photo" src="${photoOf(item.id)}" alt="" loading="lazy" />
      <div class="cart-row__info">
        <h3 class="cart-row__title">${item.name}</h3>
        <p class="cart-row__unit">${item.price} ₽ / порция</p>
      </div>
      <div class="stepper" data-id="${item.id}">
        <button class="stepper__btn" type="button" data-action="minus"
          aria-label="Уменьшить количество" ${item.quantity <= 1 ? "disabled" : ""}>−</button>
        <span class="stepper__value">${item.quantity}</span>
        <button class="stepper__btn" type="button" data-action="plus"
          aria-label="Увеличить количество" ${item.quantity >= item.stock ? "disabled" : ""}>+</button>
      </div>
      <span class="cart-row__sum">${item.price * item.quantity} ₽</span>
      <button class="cart-row__remove" type="button" data-action="remove"
        aria-label="Удалить ${item.name}">✕</button>
    </li>`;
}

function summaryHtml(): string {
  const subtotal = calculateCartTotal(cart);
  const total = calculateCartTotal(cart, promo);
  const discount = Math.round((subtotal - total) * 100) / 100;

  return `
    <div class="cart-summary__line">
      <span>Товары, ${getCartCount(cart)} шт</span>
      <span>${subtotal} ₽</span>
    </div>
    <div class="cart-summary__line">
      <span>Скидка</span>
      <span>${discount > 0 ? `−${discount} ₽` : "0 ₽"}</span>
    </div>
    <div class="cart-summary__total">
      <span>Итого</span>
      <span>${total} ₽</span>
    </div>
    <a class="btn btn--primary cart-summary__cta" href="#/checkout">Оформить заказ</a>`;
}

function render(): void {
  const list = document.querySelector<HTMLElement>("#cart-list");
  const summary = document.querySelector<HTMLElement>("#cart-summary");
  const empty = document.querySelector<HTMLElement>("#cart-empty");
  const content = document.querySelector<HTMLElement>("#cart-content");
  if (!list || !summary || !empty || !content) return;

  empty.hidden = cart.length > 0;
  content.hidden = cart.length === 0;
  list.innerHTML = cart.map(rowHtml).join("");
  summary.innerHTML = summaryHtml();

  list.querySelectorAll<HTMLImageElement>(".cart-row__photo").forEach((img) => {
    img.addEventListener("error", () => img.remove());
  });

  updateBadge();
}

export function renderCart(): string {
  return `
    <section class="cart">
      <h1 class="cart__title">Корзина</h1>

      <div class="cart__empty" id="cart-empty" hidden>
        <p class="cart__empty-text">Корзина пуста. Выберите блюда в каталоге.</p>
        <a class="btn btn--primary" href="#/catalog">В каталог</a>
      </div>

      <div class="cart__content" id="cart-content">
        <ul class="cart-list" id="cart-list"></ul>

        <div class="cart-side">
          <form class="promo" id="promo-form">
            <label class="field field--grow">
              <input class="field__control" id="promo-input" type="text"
                placeholder="Промокод" value="${promo}" aria-label="Промокод" />
            </label>
            <button class="btn btn--primary promo__btn" type="submit">Применить</button>
          </form>
          <p class="promo__msg" id="promo-msg" hidden></p>
          <div class="cart-summary" id="cart-summary"></div>
        </div>
      </div>
    </section>`;
}

export function mountCart(): void {
  cart = loadCart();
  promo = getItem<string>("promo") ?? "";
  render();

  const list = document.querySelector<HTMLElement>("#cart-list");
  const form = document.querySelector<HTMLFormElement>("#promo-form");
  const input = document.querySelector<HTMLInputElement>("#promo-input");
  const message = document.querySelector<HTMLElement>("#promo-msg");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    promo = input?.value ?? "";
    setItem("promo", promo);

    if (message) {
      if (promo.trim() === "") {
        message.hidden = true;
      } else if (isPromoValid()) {
        message.hidden = false;
        message.textContent = "Промокод применён: скидка 10%";
        message.className = "promo__msg promo__msg--ok";
      } else {
        message.hidden = false;
        message.textContent = "Такого промокода нет. Попробуйте SALE10";
        message.className = "promo__msg promo__msg--err";
      }
    }
    render();
  });

  list?.addEventListener("click", (event) => {
    const actionEl = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-action]",
    );
    if (!actionEl) return;

    const holder = actionEl.closest<HTMLElement>("[data-id]") ?? actionEl;
    const id = holder.dataset.id;
    const action = actionEl.dataset.action;
    if (!id || !action) return;

    if (action === "plus") cart = increaseQuantity(cart, id);
    if (action === "minus") cart = decreaseQuantity(cart, id);
    if (action === "remove") cart = removeItem(cart, id);

    saveCart(cart);
    render();
  });
}
