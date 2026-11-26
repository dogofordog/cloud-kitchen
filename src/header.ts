export function initBurger(): void {
  const button = document.querySelector<HTMLButtonElement>(".burger");
  const nav = document.querySelector<HTMLElement>(".nav");

  if (!button || !nav) return; 

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open"); 
    button.setAttribute("aria-expanded", String(isOpen));
  });
}