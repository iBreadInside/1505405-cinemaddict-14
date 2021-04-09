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
const countFilters = () => {
  const counter = {
    watchlist: 0,
    history: 0,
    favorites: 0,
  };
  for (const card of filmCards) {
    if (card.user_details.watchlist) counter.watchlist++;
    if (card.user_details.already_watched) counter.history++;
    if (card.user_details.favorite) counter.favorites++;
  }
  return counter;
};

render(mainElement, createMainNavigation(countFilters()), 'beforeend');

// Render statistic
render(mainElement, createStatisticRank(), 'beforeend');

const statisticSection = mainElement.querySelector('.statistic');

// Statistic filter
render(statisticSection, createStatisticFilter(), 'beforeend');

// Statistic counter
const countStatistic = () => {
  const counter = {
    watched: 0,
    total_runtime: 0,
    genre: {},
    top_genre: '',
  };
  for (const card of filmCards) {
    if (card.user_details.already_watched) {
      counter.watched++;
      counter.total_runtime += card.film_info.runtime;
      for (const genreName of card.film_info.genre) {
        if (Object.keys(counter.genre).includes(genreName)) {
          counter.genre[genreName]++;
        } else {
          Object.assign(counter.genre, counter.genre[genreName] = 1);
        }
      }
    }
  }
  // Find top genre
  const maxValue = Math.max.apply(null, Object.values(counter.genre));
  const isMostWatchedGenre = (genreName) => {
    if (counter.genre[genreName] === maxValue) return genreName;
  };
  counter.top_genre = Object.keys(counter.genre).find(isMostWatchedGenre);
  return counter;
};

render(statisticSection, createStatisticText(countStatistic()), 'beforeend');
render(footerStatisticsElement, createFooterStats(FILMS_NUMBER), 'beforeend');

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

// Extras
const compareRating = (firstCard, secondCard) => {
  const firstRating = firstCard.film_info.total_rating;
  const secondRating = secondCard.film_info.total_rating;

  return secondRating - firstRating;
};

const compareCommentsNumber = (firstCard, secondCard) => {
  const firstComments = firstCard.comments.length;
  const secondComments = secondCard.comments.length;

  return secondComments - firstComments;
};

const topRated = filmCards.slice().sort(compareRating).slice(0, FILMS_IN_EXTRAS);
const mostCommented = filmCards.slice().sort(compareCommentsNumber).slice(0, FILMS_IN_EXTRAS);

for (let i = 0; i < FILMS_IN_EXTRAS; i++) {
  render(topRatedFilmsContainer, createFilmCard(topRated[i]), 'beforeend');
  render(mostCommentedFilmsContainer, createFilmCard(mostCommented[i]), 'beforeend');
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

