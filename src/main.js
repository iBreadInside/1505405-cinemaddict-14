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
import { generateComments } from './mock/comments.js';
import { createComments } from './view/comment.js';

const FILMS_NUMBER = 17;
const FILMS_IN_LINE = 5;
const FILMS_IN_EXTRAS = 2;
const COMMENTS_NUMBER = 5;

const siteBodyElement = document.body;
const headerElement = document.querySelector('.header__logo');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const filmCards = new Array(FILMS_NUMBER).fill().map(generateFilmCard);
const comments = new Array(COMMENTS_NUMBER).fill().map(generateComments);

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
const filmsListSection = filmsSection.querySelector('.films-list');
const filmsListContainer = filmsSection.querySelector('.films-list__container');
const topRatedFilmsContainer = filmsSection.querySelector('.films-list__container--top-rated');
const mostCommentedFilmsContainer = filmsSection.querySelector('.films-list__container--most-commented');

for (let i = 0; i < Math.min(FILMS_IN_LINE, filmCards.length); i++) {
  render(filmsListContainer, createFilmCard(filmCards[i]), 'beforeend');
}

for (let i = 0; i < FILMS_IN_EXTRAS; i++) {
  render(topRatedFilmsContainer, createFilmCard(filmCards[i]), 'beforeend');
  render(mostCommentedFilmsContainer, createFilmCard(filmCards[i]), 'beforeend');
}

// Render film details popup
const onFilmCardClick = () => {
  render(siteBodyElement, createFilmDetails(filmCards[0]), 'beforeend');

  const filmDetailsElement = document.querySelector('.film-details');
  const detailsClose = filmDetailsElement.querySelector('.film-details__close-btn');
  const commentsList = filmDetailsElement.querySelector('.film-details__comments-list');

  render(commentsList, createComments(comments[0]), 'beforeend');

  const onCloseBtnClick = () => {
    filmDetailsElement.remove();
  };

  detailsClose.addEventListener('click', onCloseBtnClick);
};

const addCardsListeners = () => {
  const filmCardElements = document.querySelectorAll('.film-card');
  for (const card of filmCardElements) {
    const filmCardPoster = card.querySelector('.film-card__poster');
    const filmCardTitle = card.querySelector('.film-card__title');
    const filmCardComment = card.querySelector('.film-card__comments');
    filmCardPoster.addEventListener('click', onFilmCardClick);
    filmCardTitle.addEventListener('click', onFilmCardClick);
    filmCardComment.addEventListener('click', onFilmCardClick);
  }
};

// Show more
if (filmCards.length > FILMS_IN_LINE) {
  let renderedCardCount = FILMS_IN_LINE;

  render(filmsListSection, createShowMoreButton(), 'beforeend');
  addCardsListeners();

  const showMoreBtn = filmsSection.querySelector('.films-list__show-more');

  showMoreBtn.addEventListener('click', () => {
    filmCards
      .slice(renderedCardCount, renderedCardCount + FILMS_IN_LINE)
      .forEach((filmCard) => render(filmsListContainer, createFilmCard(filmCard), 'beforeend'));

    addCardsListeners();

    renderedCardCount += FILMS_IN_LINE;

    if (renderedCardCount >= filmCards.length) {
      showMoreBtn.remove();
    }
  });
}

