import { initReveal } from "./reveal";
import { renderAbout } from "./pages/about";
import { renderCatalog, mountCatalog } from "./pages/catalog";

type Route = () => string;

const routes: Record<string, Route> = {
  "#/about": renderAbout,
  "#/catalog": renderCatalog,
};

// Хуки после отрисовки: вешаем обработчики событий страницы.
// Отдельный словарь, чтобы страницы без обработчиков не менялись.
const mounts: Record<string, () => void> = {
  "#/catalog": mountCatalog,
};

const renderStub: Route = () =>
  `<section><h1>Страница в разработке</h1></section>`;

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
    highlightActiveLink(hash);
    initReveal();
    mounts[hash]?.();
    window.scrollTo(0, 0);
  };

  window.addEventListener("hashchange", render);
  render();
}
