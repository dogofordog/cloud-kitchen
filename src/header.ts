export function initBurger(): void {
  const button = document.querySelector<HTMLButtonElement>(".burger");
  const nav = document.querySelector<HTMLElement>(".nav");

  if (!button || !nav) return;

  const setOpen = (isOpen: boolean): void => {
    nav.classList.toggle("nav--open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
  };

  button.addEventListener("click", () => {
    setOpen(!nav.classList.contains("nav--open"));
  });

  nav.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  });
}