import ProfileInfo from './view/profile.js';
import MainNavigation from './view/main-navigation.js';
import StatisticRank from './view/statistic-rank.js';
import StatisticFilter from './view/statistic-filter.js';
import StatisticText from './view/statistic-text.js';
import FooterStats from './view/footer-stats.js';
import FilmsSection from './view/films-section';
import FilmCard from './view/film-card.js';
import ShowMoreButton from './view/show-more-button.js';
import FilmDetails from './view/film-details.js';
import { generateFilmCard } from './mock/film-info.js';
import { generateComments } from './mock/comments.js';
import Comments from './view/comment.js';
import { renderElement, RenderPosition, renderTemplate } from './utils.js';
import StatisticSection from './view/statistic-section.js';

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

const filmsSectionComponent = new FilmsSection();

// Render profile info
renderElement(headerElement, new ProfileInfo().getElement(), RenderPosition.BEFOREEND);

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

renderElement(mainElement, new MainNavigation(countFilters()).getElement(), RenderPosition.BEFOREEND);

// Render statistic
const statisticSection = new StatisticSection();
renderElement(mainElement, statisticSection.getElement(), RenderPosition.BEFOREEND);
renderElement(statisticSection.getElement(), new StatisticRank().getElement(), RenderPosition.BEFOREEND);
renderElement(statisticSection.getElement(), new StatisticFilter().getElement(), RenderPosition.BEFOREEND);

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
        if (genreName in counter.genre) {
          counter.genre[genreName]++;
        } else {
          counter.genre[genreName] = 1;
        }
      }
    }
  }
  let maxValue = 0;
  let maxKey = 0;
  for (const genreName of Object.keys(counter.genre)) {
    if (counter.genre[genreName] > maxValue) {
      maxValue = counter.genre[genreName];
      maxKey = genreName;
    }
    counter.top_genre = maxKey;
  }
  return counter;
};

renderElement(statisticSection.getElement(), new StatisticText(countStatistic()).getElement(), RenderPosition.BEFOREEND);
renderElement(footerStatisticsElement, new FooterStats(FILMS_NUMBER).getElement(), RenderPosition.BEFOREEND);

// Render films section
renderElement(mainElement, filmsSectionComponent.getElement(), RenderPosition.BEFOREEND);
const filmsListContainer = filmsSectionComponent.getElement().querySelector('.films-list__container');

for (let i = 0; i < Math.min(FILMS_IN_LINE, filmCards.length); i++) {
  renderElement(filmsListContainer, new FilmCard(filmCards[i]).getElement(), RenderPosition.BEFOREEND);
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
  renderElement(filmsSectionComponent.getElement().querySelector('.films-list__container--top-rated'), new FilmCard(topRated[i]).getElement(), RenderPosition.BEFOREEND);
  renderElement(filmsSectionComponent.getElement().querySelector('.films-list__container--most-commented'), new FilmCard(mostCommented[i]).getElement(), RenderPosition.BEFOREEND);
}

// Render film details popup
// const onFilmCardClick = () => {
//   const filmPopup = new FilmDetails(filmCards[0]);
//   renderElement(siteBodyElement, filmPopup.getElement(), RenderPosition.BEFOREEND);

//   const filmDetailsElement = document.querySelector('.film-details');
//   const detailsClose = filmDetailsElement.querySelector('.film-details__close-btn');
//   const commentsList = filmDetailsElement.querySelector('.film-details__comments-list');

//   renderTemplate(commentsList, createComments(comments[0]), 'beforeend');

//   const onCloseBtnClick = () => {
//     filmDetailsElement.remove();
//   };

//   detailsClose.addEventListener('click', onCloseBtnClick);
// };

// const addCardsListeners = () => {
//   const filmCardElements = document.querySelectorAll('.film-card');
//   for (const card of filmCardElements) {
//     const filmCardPoster = card.querySelector('.film-card__poster');
//     const filmCardTitle = card.querySelector('.film-card__title');
//     const filmCardComment = card.querySelector('.film-card__comments');
//     filmCardPoster.addEventListener('click', onFilmCardClick);
//     filmCardTitle.addEventListener('click', onFilmCardClick);
//     filmCardComment.addEventListener('click', onFilmCardClick);
//   }
// };

// Show more
if (filmCards.length > FILMS_IN_LINE) {
  const filmsList = filmsSectionComponent.getElement().querySelector('.films-list');
  let renderedCardCount = FILMS_IN_LINE;

  renderElement(filmsList, new ShowMoreButton().getElement(), RenderPosition.BEFOREEND);
  // addCardsListeners();

  const showMoreBtn = filmsSectionComponent.getElement().querySelector('.films-list__show-more');

  showMoreBtn.addEventListener('click', () => {
    filmCards
      .slice(renderedCardCount, renderedCardCount + FILMS_IN_LINE)
      .forEach((filmCard) => renderElement(filmsListContainer, new FilmCard(filmCard).getElement(), RenderPosition.BEFOREEND));

    // addCardsListeners();

    renderedCardCount += FILMS_IN_LINE;

    if (renderedCardCount >= filmCards.length) {
      showMoreBtn.remove();
    }
  });
}

