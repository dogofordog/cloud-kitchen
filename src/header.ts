export function initBurger(): void {
  const button = document.querySelector<HTMLButtonElement>(".burger");
  const nav = document.querySelector<HTMLElement>(".nav");

  if (!button || !nav) return; 

  const setOpen = (isOpen: boolean): void => {
    nav.classList.toggle("nav--open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  };

  button.addEventListener("click", () => {
    setOpen(!nav.classList.contains("nav--open"));
  });

  nav.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  });
}

export function initHeaderScroll(): void {
  const header = document.querySelector<HTMLElement>(".header");
  if (!header) return;

  const update = (): void => {
    header.classList.toggle("header--scrolled", window.scrollY > 8);
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}
