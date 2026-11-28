import productsData from "../data/products.json";
import type { Product } from "../productTypes";
import {
  DEFAULT_FILTERS,
  filterProducts,
  type CatalogFilters,
} from "../logic/catalog";
import { getVisibleItems, getNextStep, PAGE_SIZE } from "../logic/pagination";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  getCartCount,
  type CartItem,
} from "../logic/cart";
import { loadCart, saveCart } from "../logic/storage";
const catalog = productsData as Product[];

const CATEGORY_EMOJI: Record<string, string> = {
  Завтраки: "🍳",
  Обеды: "🥗",
  Ужины: "🍲",
  Перекусы: "🌯",
  Десерты: "🍰",
};

const CATEGORY_SLUG: Record<string, string> = {
  Завтраки: "breakfast",
  Обеды: "lunch",
  Ужины: "dinner",
  Перекусы: "snack",
  Десерты: "dessert",
};

const assetUrl = (path: string): string => `${import.meta.env.BASE_URL}${path}`;
const photoCandidates = (product: Product): string[] => {
  const base = product.image.replace(/\.[^.]+$/, "");
  return [
    ...new Set([
      assetUrl(`images/${product.image}`),
      assetUrl(`images/${base}.jpg`),
      assetUrl(`images/${base}.webp`),
      assetUrl(
        `images/categories/${CATEGORY_SLUG[product.category] ?? "lunch"}.jpg`,
      ),
    ]),
  ];
};

let filters: CatalogFilters = { ...DEFAULT_FILTERS };
let visibleCount = PAGE_SIZE;
let cart: CartItem[] = loadCart();

const categories: string[] = [
  "all",
  ...Array.from(new Set(catalog.map((product) => product.category))),
];

// В данных КБЖУ на 100 г — переводим на порцию
const perPortion = (value: number, weight: number): number =>
  Math.round((value * weight) / 100);

const dishWord = (count: number): string => {
  if (count === 1) return "блюдо";
  if (count >= 2 && count <= 4) return "блюда";
  return "блюд";
};

const SEARCH_ICON = `<svg class="field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></svg>`;
const CHEVRON = `<svg class="field__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;

export function updateBadge(): void {
  const badge = document.querySelector<HTMLElement>(".badge");
  if (!badge) return;
  const count = getCartCount(cart);
  badge.hidden = count === 0;
  badge.textContent = String(count);
}

function cardHtml(product: Product): string {
  const inCart = cart.find((item) => item.id === product.id);
  const outOfStock = product.qty <= 0;
  const [first, ...rest] = photoCandidates(product);

  let control: string;
  if (outOfStock) {
    control = `<button class="card__btn card__btn--disabled" type="button" disabled>Нет в наличии</button>`;
  } else if (inCart) {
    control = `
      <div class="stepper" data-id="${product.id}">
        <button class="stepper__btn" type="button" data-action="minus"
          aria-label="Уменьшить количество" ${inCart.quantity <= 1 ? "disabled" : ""}>−</button>
        <span class="stepper__value">${inCart.quantity}</span>
        <button class="stepper__btn" type="button" data-action="plus"
          aria-label="Увеличить количество" ${inCart.quantity >= product.qty ? "disabled" : ""}>+</button>
      </div>`;
  } else {
    control = `<button class="btn btn--primary card__btn" type="button" data-action="add" data-id="${product.id}">В корзину</button>`;
  }

  const tags = product.tags
    .slice(0, 2)
    .map((tag) => `<span class="chip">${tag}</span>`)
    .join("");

  const flag = outOfStock
    ? `<span class="card__flag">Нет в наличии</span>`
    : "";

  return `
    <article class="card${outOfStock ? " card--out" : ""}">
      <div class="card__media">
        <span class="card__emoji" aria-hidden="true">${CATEGORY_EMOJI[product.category] ?? "🍽"}</span>
        <img class="card__photo" src="${first}" data-fallbacks="${rest.join("|")}"
          alt="${product.name}" loading="lazy" decoding="async" />
        <span class="card__category">${product.category}</span>
        ${flag}
      </div>
      <div class="card__body">
        <h3 class="card__title">${product.name}</h3>
        <p class="card__meta">${product.weight} г · ${perPortion(product.calories, product.weight)} ккал / порция</p>
        <p class="card__macros">Б ${perPortion(product.protein, product.weight)} · Ж ${perPortion(product.fat, product.weight)} · У ${perPortion(product.carbs, product.weight)} г</p>
        <div class="card__tags">${tags}</div>
        <div class="card__foot">
          <span class="card__price">${product.price} ₽</span>
          ${control}
        </div>
      </div>
    </article>`;
}

// Перерисовываем только сетку: фокус в полях фильтров не теряется
function renderGrid(): void {
  const filtered = filterProducts(catalog, filters);
  const visible = getVisibleItems(filtered, visibleCount);
  const next = getNextStep(filtered.length, visibleCount);

  const grid = document.querySelector<HTMLElement>("#catalog-grid");
  const more = document.querySelector<HTMLButtonElement>("#catalog-more");
  const empty = document.querySelector<HTMLElement>("#catalog-empty");
  const count = document.querySelector<HTMLElement>("#catalog-count");
  if (!grid || !more || !empty || !count) return;

  grid.innerHTML = visible.map(cardHtml).join("");
  count.textContent = `Показано ${visible.length} из ${filtered.length}`;
  empty.hidden = filtered.length !== 0;
  more.hidden = next === 0;
  more.textContent = `Показать ещё ${next} ${dishWord(next)}`;

  // Фото не загрузилось — пробуем следующий вариант, в конце убираем img (останется эмодзи)
  grid.querySelectorAll<HTMLImageElement>(".card__photo").forEach((img) => {
    img.addEventListener("error", () => {
      const list = (img.dataset.fallbacks ?? "").split("|").filter(Boolean);
      if (list.length === 0) {
        img.remove();
        return;
      }
      img.dataset.fallbacks = list.slice(1).join("|");
      img.src = list[0];
    });
  });
}

export function renderCatalog(): string {
  const categoryOptions = categories
    .map((category) => {
      const label = category === "all" ? "Все категории" : category;
      const selected = filters.category === category ? "selected" : "";
      return `<option value="${category}" ${selected}>${label}</option>`;
    })
    .join("");

  return `
    <section class="catalog">
      <div class="catalog__head">
        <h1 class="catalog__title">Меню</h1>
        <span class="catalog__count" id="catalog-count"></span>
      </div>

      <form class="filters" id="catalog-filters">
        <label class="field field--search">
          ${SEARCH_ICON}
          <input class="field__control" type="search" id="filter-search"
            placeholder="Найти блюдо" value="${filters.search}" aria-label="Поиск по каталогу" />
        </label>

        <label class="field">
          <select class="field__control field__control--select" id="filter-category" aria-label="Категория">
            ${categoryOptions}
          </select>
          ${CHEVRON}
        </label>

        <div class="filters__row">
          <label class="field">
            <input class="field__control" type="number" min="0" id="filter-price-from"
              placeholder="Цена от, ₽" value="${filters.priceFrom ?? ""}" aria-label="Цена от" />
          </label>
          <label class="field">
            <input class="field__control" type="number" min="0" id="filter-price-to"
              placeholder="до, ₽" value="${filters.priceTo ?? ""}" aria-label="Цена до" />
          </label>
        </div>

        <div class="filters__row">
          <label class="field field--grow">
            <select class="field__control field__control--select" id="filter-sort" aria-label="Сортировка">
              <option value="default" ${filters.sort === "default" ? "selected" : ""}>По умолчанию</option>
              <option value="price-asc" ${filters.sort === "price-asc" ? "selected" : ""}>Сначала дешевле</option>
              <option value="price-desc" ${filters.sort === "price-desc" ? "selected" : ""}>Сначала дороже</option>
            </select>
            ${CHEVRON}
          </label>
          <button class="btn-reset" type="button" id="filter-reset">Сбросить</button>
        </div>
      </form>

      <div class="catalog__grid" id="catalog-grid"></div>
      <p class="catalog__empty" id="catalog-empty" hidden>Ничего не найдено. Попробуйте изменить фильтры.</p>
      <button class="catalog__more" id="catalog-more" type="button"></button>
    </section>`;
}

export function mountCatalog(): void {
  cart = loadCart();
  renderGrid();
  updateBadge();

  const search = document.querySelector<HTMLInputElement>("#filter-search");
  const category =
    document.querySelector<HTMLSelectElement>("#filter-category");
  const from = document.querySelector<HTMLInputElement>("#filter-price-from");
  const to = document.querySelector<HTMLInputElement>("#filter-price-to");
  const sort = document.querySelector<HTMLSelectElement>("#filter-sort");
  const reset = document.querySelector<HTMLButtonElement>("#filter-reset");
  const grid = document.querySelector<HTMLElement>("#catalog-grid");
  const more = document.querySelector<HTMLButtonElement>("#catalog-more");

  const parsePrice = (value: string): number | null => {
    if (value.trim() === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const apply = (): void => {
    visibleCount = PAGE_SIZE;
    renderGrid();
  };

  search?.addEventListener("input", () => {
    filters = { ...filters, search: search.value };
    apply();
  });
  category?.addEventListener("change", () => {
    filters = { ...filters, category: category.value };
    apply();
  });
  from?.addEventListener("input", () => {
    filters = { ...filters, priceFrom: parsePrice(from.value) };
    apply();
  });
  to?.addEventListener("input", () => {
    filters = { ...filters, priceTo: parsePrice(to.value) };
    apply();
  });
  sort?.addEventListener("change", () => {
    filters = { ...filters, sort: sort.value as CatalogFilters["sort"] };
    apply();
  });
  reset?.addEventListener("click", () => {
    filters = { ...DEFAULT_FILTERS };
    if (search) search.value = "";
    if (category) category.value = "all";
    if (from) from.value = "";
    if (to) to.value = "";
    if (sort) sort.value = "default";
    apply();
  });

  more?.addEventListener("click", () => {
    visibleCount += PAGE_SIZE;
    renderGrid();
  });

  // Делегирование: один слушатель на все кнопки всех карточек
  grid?.addEventListener("click", (event) => {
    const actionEl = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-action]",
    );
    if (!actionEl) return;

    const holder = actionEl.closest<HTMLElement>("[data-id]") ?? actionEl;
    const id = holder.dataset.id;
    const action = actionEl.dataset.action;
    if (!id || !action) return;

    const product = catalog.find((item) => item.id === id);
    if (!product) return;

    if (action === "add") cart = addToCart(cart, product);
    if (action === "plus") cart = increaseQuantity(cart, id);
    if (action === "minus") cart = decreaseQuantity(cart, id);

    saveCart(cart);
    updateBadge();
    renderGrid();
  });
}
