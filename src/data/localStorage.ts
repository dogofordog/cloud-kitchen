export const NAME_SPACE = "dark-kitchen";

export function getItem<T>(key: string = "", namespace: string = NAME_SPACE): T | null {
  try {
    const value = localStorage.getItem(`${namespace}:${key}`);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string = "", item: T, namespace: string = NAME_SPACE): boolean {
  try {
    localStorage.setItem(`${namespace}:${key}`, JSON.stringify(item));
    return true;
  } catch {
    return false;
  }
}

export function removeItem(key: string = "", namespace: string = NAME_SPACE): boolean {
  try {
    localStorage.removeItem(`${namespace}:${key}`);
    return true;
  } catch {
    return false;
  }
}
