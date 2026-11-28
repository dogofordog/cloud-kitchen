export const PAGE_SIZE = 8;

export function getVisibleItems<T>(items: T[], visibleCount: number): T[] {
  return items.slice(0, Math.max(visibleCount, 0));
}

// Сколько блюд добавит следующее нажатие «Показать ещё».
export function getNextStep(
  total: number,
  visibleCount: number,
  step: number = PAGE_SIZE,
): number {
  const remaining = Math.max(total - visibleCount, 0);
  return Math.min(step, remaining);
}
