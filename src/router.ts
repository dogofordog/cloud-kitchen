import { initReveal } from "./reveal";
import { renderAbout } from "./pages/about";

type Route = () => string;

const routes: Record<string, Route> = {
  "#/about": renderAbout,
};

const renderStub: Route = () => `<section><h1>Страница в разработке</h1></section>`;

function highlightActiveLink(hash: string): void {
  document.querySelectorAll<HTMLAnchorElement>(".nav__link").forEach((link) => {
    const isActive = link.getAttribute("href") === hash;
    link.classList.toggle("nav__link--active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

export function initRouter(): void {
  const app = document.querySelector<HTMLElement>("#app");
  if (!app) return;

  const render = (): void => {
    const hash = location.hash || "#/about";
    const page = routes[hash] ?? renderStub; 
    app.innerHTML = page();
    initReveal();
    highlightActiveLink(hash);
    window.scrollTo(0, 0);
  };

  window.addEventListener("hashchange", render);
  render();
}