const NAME_SPACE = "dark-kitchen";

export function getItem<T>(key: string = "", namespace: string = NAME_SPACE): T {
  throw new Error();
}

export function setItem<T>(key: string = "", item: T, namespace: string = NAME_SPACE): boolean {
  throw new Error();
}

export function removeItem(key: string = "", namespace: string = NAME_SPACE): boolean {
  throw new Error();
}
