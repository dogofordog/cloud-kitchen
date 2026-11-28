import { describe, it, expect } from "vitest";
import {
  getVisibleItems,
  getNextStep,
  PAGE_SIZE,
} from "../src/logic/pagination";

const range = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => i + 1);

describe("getVisibleItems", () => {
  it("возвращает первые N элементов", () => {
    expect(getVisibleItems(range(24), 8)).toEqual(range(8));
  });
  it("если просят больше, чем есть, возвращает всё", () => {
    expect(getVisibleItems(range(5), 8)).toEqual(range(5));
  });
  it("ноль и отрицательное число дают пустой список", () => {
    expect(getVisibleItems(range(24), 0)).toEqual([]);
    expect(getVisibleItems(range(24), -3)).toEqual([]);
  });
  it("пустой список остаётся пустым", () => {
    expect(getVisibleItems([], 8)).toEqual([]);
  });
  it("не меняет исходный массив", () => {
    const items = range(24);
    getVisibleItems(items, 8);
    expect(items).toHaveLength(24);
  });
});

describe("getNextStep", () => {
  it("по умолчанию шаг равен PAGE_SIZE (8)", () => {
    expect(PAGE_SIZE).toBe(8);
    expect(getNextStep(24, 8)).toBe(8);
  });
  it("на последней порции показывает остаток", () => {
    expect(getNextStep(24, 20)).toBe(4);
  });
  it("когда показано всё, шаг равен 0", () => {
    expect(getNextStep(24, 24)).toBe(0);
  });
  it("если показано больше, чем всего, шаг тоже 0", () => {
    expect(getNextStep(5, 8)).toBe(0);
  });
  it("если блюд меньше порции, кнопка добавит остаток", () => {
    expect(getNextStep(5, 0)).toBe(5);
  });
});
