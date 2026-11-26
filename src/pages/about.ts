import heroImage from "../assets/hero.jpg";

interface TeamMember {
  login: string; 
  url: string; 
  contribution: string;
}

const team: TeamMember[] = [
  {
    login: "dogofordog",
    url: "https://github.com/dogofordog",
    contribution: "Страницы, вёрстка и тема, корзина и подсчёт суммы, деплой",
  },
  {
    login: "AleksandraRog",
    url: "https://github.com/AleksandraRog",
    contribution:
      "Каталог данных, поиск, фильтры и сортировка, сохранение корзины, валидация формы, тесты",
  },
];

const benefits = [
  { title: "Честный состав", text: "Информация о блюдах — в каталоге." },
  { title: "Баланс без подсчётов", text: "Калории и БЖУ указаны на порцию." },
  { title: "В вашем ритме", text: "Выберите блюда и оформите заказ." },
];

export function renderAbout(): string {
  const benefitsHtml = benefits
    .map(
      (item, index) => `
      <article class="benefit">
        <div class="benefit__head">
          <span class="benefit__number">${String(index + 1).padStart(2, "0")}</span>
          <h3 class="benefit__title">${item.title}</h3>
        </div>
        <p class="benefit__text">${item.text}</p>
      </article>`,
    )
    .join("");

  const teamHtml = team
    .map(
      (member) => `
      <article class="member">
        <h3 class="member__name">${member.login}</h3>
        <a class="member__link" href="${member.url}" target="_blank" rel="noopener noreferrer">
          ${member.url.replace("https://", "")}
        </a>
        <p class="member__text">${member.contribution}</p>
      </article>`,
    )
    .join("");

  return `
    <section class="hero">
      <div class="hero__content">
        <p class="hero__label">Доставка готовой еды</p>
        <h1 class="hero__title">Еда, которая заботится о вас.</h1>
        <p class="hero__subtitle">А время — остаётся вам.</p>
        <p class="hero__text">Меню из 24 готовых блюд с калориями и КБЖУ на порцию, корзиной и формой заказа.</p>
        <a class="btn btn--primary hero__cta" href="#/catalog">В каталог</a>
        <p class="hero__stats">24 блюда · 5 категорий</p>
      </div>
      <img class="hero__image" src="${heroImage}" alt="Боул с лососем и авокадо" />
    </section>

    <section class="benefits">${benefitsHtml}</section>

    <section class="team">
      <h2 class="team__title">Команда</h2>
      <div class="team__list">${teamHtml}</div>
    </section>
  `;
}