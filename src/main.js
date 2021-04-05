import { createProfileInfo } from './view/profile.js';
import { createMainNavigation } from './view/main-navigation.js';
import { createStatisticRank } from './view/statistic-rank.js';
import { createStatisticFilter } from './view/statistic-filter.js';
import { createStatisticText } from './view/statistic-text.js';
import { createFooterStats } from './view/footer-stats.js';
import { createFilmCard } from './view/film-card.js';
import { createFilmsSection } from './view/films-section.js';
import { createShowMoreButton } from './view/show-more-button.js';
import { createFilmDetails } from './view/film-details.js';
import { generateFilmCard } from './mock/film-info.js';

const FILMS_NUMBER = 17;
const FILMS_IN_LINE = 5;
const FILMS_IN_EXTRAS = 2;

const siteBodyElement = document.body;
const headerElement = document.querySelector('.header__logo');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const filmCards = new Array(FILMS_NUMBER).fill().map(generateFilmCard);
console.log(filmCards);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place,template);
};

// Render profile info
render(headerElement, createProfileInfo(), 'beforeend');

// Render main navigation
render(mainElement, createMainNavigation(), 'beforeend');

// Render statistic
render(mainElement, createStatisticRank(), 'beforeend');

const statisticSection = mainElement.querySelector('.statistic');

render(statisticSection, createStatisticFilter(), 'beforeend');
render(statisticSection, createStatisticText(), 'beforeend');
render(footerStatisticsElement, createFooterStats(), 'beforeend');

// Render films section
render(mainElement, createFilmsSection(), 'beforeend');

const filmsSection = mainElement.querySelector('.films');
const filmsListContainer = filmsSection.querySelector('.films-list__container');
const topRatedFilmsContainer = filmsSection.querySelector('.films-list__container--top-rated');
const mostCommentedFilmsContainer = filmsSection.querySelector('.films-list__container--most-commented');

for (let i = 0; i < FILMS_IN_LINE; i++) {
  render(filmsListContainer, createFilmCard(filmCards[i]), 'beforeend');
}

render(filmsListContainer, createShowMoreButton(), 'beforeend');

for (let i = 0; i < FILMS_IN_EXTRAS; i++) {
  render(topRatedFilmsContainer, createFilmCard(filmCards[i]), 'beforeend');
  render(mostCommentedFilmsContainer, createFilmCard(filmCards[i]), 'beforeend');
}

// Render film details popup
render(siteBodyElement, createFilmDetails(), 'beforeend');
