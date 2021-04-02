import { createMainNavigation } from './view/main-navigation.js';
import { createStatisticRank } from './view/statistic-rank.js';
import { createFilmCard } from './view/film-card.js';
import { createFilmsSection } from './view/films-section.js';
import { createShowMoreButton } from './view/show-more-button.js';

const FILMS_IN_LINE = 5;
const FILMS_IN_EXTRAS = 2;

// const siteHeaderLogoElement = document.querySelector('.header__logo');
const mainElement = document.querySelector('.main');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place,template);
};

// Render main navigation
render(mainElement, createMainNavigation(), 'beforeend');

// Render statistic section
render(mainElement, createStatisticRank(), 'beforeend');

// Render films section
render(mainElement, createFilmsSection(), 'beforeend');

const filmsSection = mainElement.querySelector('.films');
const filmsListContainer = filmsSection.querySelector('.films-list__container');
const topRatedFilmsContainer = filmsSection.querySelector('.films-list__container--top-rated');
const mostCommentedFilmsContainer = filmsSection.querySelector('.films-list__container--most-commented');

for (let i = 0; i < FILMS_IN_LINE; i++) {
  render(filmsListContainer, createFilmCard(), 'beforeend');
}

render(filmsListContainer, createShowMoreButton(), 'beforeend');

for (let i = 0; i < FILMS_IN_EXTRAS; i++) {
  render(topRatedFilmsContainer, createFilmCard(), 'beforeend');
  render(mostCommentedFilmsContainer, createFilmCard(), 'beforeend');
}
