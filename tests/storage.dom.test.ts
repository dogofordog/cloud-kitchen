import { beforeEach, describe, expect, it } from "vitest";
import { getItem, NAME_SPACE, setItem } from "../src/data/localStorage";
import type { CartItem } from "../src/logic/cart";
import { loadCart, saveCart } from "../src/logic/storage";

describe("storage: чтение данных (getItem и loadCart)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getItem", () => {
    it("читает и парсит данные по ключу с учетом namespace", () => {
      localStorage.setItem(`${NAME_SPACE}:user`, JSON.stringify({ name: "Анна" }));

      const result = getItem<{ name: string }>("user");

      expect(result).toEqual({ name: "Анна" });
    });

    it("возвращает null, если ключ не найден", () => {
      expect(getItem("non-existent")).toBeNull();
    });

    it("не падает и возвращает null, если в localStorage лежит битый JSON", () => {
      localStorage.setItem(`${NAME_SPACE}:broken`, "{not-valid-json");

      expect(getItem("broken")).toBeNull();
    });
  });

  describe("loadCart", () => {
    it("возвращает сохраненный массив товаров корзины", () => {
      const mockCart: CartItem[] = [
        {
          id: "brk-01",
          name: "Сырники",
          price: 330,
          stock: 1,
          quantity: 2,
        },
      ];
      localStorage.setItem(`${NAME_SPACE}:cart-items`, JSON.stringify(mockCart));

      expect(loadCart()).toEqual(mockCart);
    });

    it("возвращает пустой массив [], если корзина еще не сохранялась", () => {
      expect(loadCart()).toEqual([]);
    });

    it("возвращает пустой массив [], если в хранилище записан не массив (например, объект или число)", () => {
      localStorage.setItem(`${NAME_SPACE}:cart-items`, JSON.stringify({ broken: true }));
      expect(loadCart()).toEqual([]);

      localStorage.setItem(`${NAME_SPACE}:cart-items`, "12345");
      expect(loadCart()).toEqual([]);
    });
  });
});

describe("storage: запись данных (setItem и saveCart)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("setItem", () => {
    it("сериализует значение в JSON, сохраняет с учетом namespace и возвращает true", () => {
      const payload = { theme: "dark", count: 3 };

      const isSaved = setItem("settings", payload);

      expect(isSaved).toBe(true);
      expect(localStorage.getItem(`${NAME_SPACE}:settings`)).toBe(JSON.stringify(payload));
    });

    it("поддерживает кастомный namespace", () => {
      setItem("token", "abc-123", "custom-ns");

      expect(localStorage.getItem("custom-ns:token")).toBe('"abc-123"');
      expect(localStorage.getItem(`${NAME_SPACE}:token`)).toBeNull();
    });

    it("перезаписывает существующее значение по тому же ключу", () => {
      setItem("step", 1);
      setItem("step", 2);

      expect(getItem<number>("step")).toBe(2);
    });

    it("не падает и возвращает false при ошибке записи (например, переполнение квоты или запрет инкогнито)", () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });

      const isSaved = setItem<number[]>("big-data", [1, 2, 3]);

      expect(isSaved).toBe(false);
    });
  });

  describe("saveCart", () => {
    const mockCart: CartItem[] = [
      {
        id: "brk-01",
        name: "Сырники из фермерского творога",
        price: 330,
        stock: 1,
        quantity: 2,
      },
      {
        id: "lnc-02",
        name: "Боул с лососем терияки",
        price: 590,
        stock: 1,
        quantity: 1,
      },
    ];

    it("сохраняет массив товаров корзины и корректно читается через loadCart", () => {
      saveCart(mockCart);

      const raw = localStorage.getItem(`${NAME_SPACE}:cart-items`);
      expect(raw).not.toBeNull();
      expect(loadCart()).toEqual(mockCart);
    });

    it("очищает корзину при сохранении пустого массива []", () => {
      saveCart(mockCart);
      expect(loadCart()).toHaveLength(2);

      saveCart([]);
      expect(loadCart()).toEqual([]);
    });
  });
});
