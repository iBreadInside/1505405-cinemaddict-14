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
import { render, RenderPosition, toggleClass } from './utils.js';
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
render(headerElement, new ProfileInfo().getElement(), RenderPosition.BEFOREEND);

// Render main navigation
const countFilters = () => {
  const Сounter = {
    watchlist: 0,
    history: 0,
    favorites: 0,
  };
  for (const card of filmCards) {
    if (card.user_details.watchlist) Сounter.watchlist++;
    if (card.user_details.already_watched) Сounter.history++;
    if (card.user_details.favorite) Сounter.favorites++;
  }
  return Сounter;
};

render(mainElement, new MainNavigation(countFilters()).getElement(), RenderPosition.BEFOREEND);

// Render films section
render(mainElement, filmsSectionComponent.getElement(), RenderPosition.BEFOREEND);
const filmsListContainer = filmsSectionComponent.getElement().querySelector('.films-list__container');

const renderFilmCard = (filmList, card) => {
  const filmCardComponent = new FilmCard(card);
  const filmPopup = new FilmDetails(filmCards[0]);

  // Render film details popup
  const onFilmCardClick = () => {
    siteBodyElement.appendChild(filmPopup.getElement());
    toggleClass(siteBodyElement, 'hide-overflow');

    render(filmPopup.getElement().querySelector('.film-details__comments-list'), new Comments(comments[0]).getElement(), RenderPosition.BEFOREEND);

    const onCloseBtnClick = () => {
      siteBodyElement.removeChild(filmPopup.getElement());
      toggleClass(siteBodyElement, 'hide-overflow');
    };

    filmPopup.getElement().querySelector('.film-details__close-btn').addEventListener('click', onCloseBtnClick);
  };

  // Render filmcard with listeners
  render(filmList, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
  filmCardComponent.getElement().querySelector('.film-card__poster').addEventListener('click', onFilmCardClick);
  filmCardComponent.getElement().querySelector('.film-card__title').addEventListener('click', onFilmCardClick);
  filmCardComponent.getElement().querySelector('.film-card__comments').addEventListener('click', onFilmCardClick);
};

for (let i = 0; i < Math.min(FILMS_IN_LINE, filmCards.length); i++) {
  renderFilmCard(filmsListContainer, filmCards[i]);
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
  renderFilmCard(filmsSectionComponent.getElement().querySelector('.films-list__container--top-rated'), topRated[i]);
  renderFilmCard(filmsSectionComponent.getElement().querySelector('.films-list__container--most-commented'), mostCommented[i]);
}

// Show more
if (filmCards.length > FILMS_IN_LINE) {
  let renderedCardCount = FILMS_IN_LINE;

  render(filmsSectionComponent.getElement().querySelector('.films-list'), new ShowMoreButton().getElement(), RenderPosition.BEFOREEND);

  const showMoreBtn = filmsSectionComponent.getElement().querySelector('.films-list__show-more');

  showMoreBtn.addEventListener('click', () => {
    filmCards
      .slice(renderedCardCount, renderedCardCount + FILMS_IN_LINE)
      .forEach((filmCard) => renderFilmCard(filmsListContainer, filmCard));

    renderedCardCount += FILMS_IN_LINE;

    if (renderedCardCount >= filmCards.length) {
      showMoreBtn.remove();
    }
  });
}

// Render statistic
const statisticSection = new StatisticSection();
render(mainElement, statisticSection.getElement(), RenderPosition.BEFOREEND);
render(statisticSection.getElement(), new StatisticRank().getElement(), RenderPosition.BEFOREEND);
render(statisticSection.getElement(), new StatisticFilter().getElement(), RenderPosition.BEFOREEND);

// Statistic counter
const countStatistic = () => {
  const Сounter = {
    watched: 0,
    total_runtime: 0,
    genre: {},
    top_genre: '',
  };
  for (const card of filmCards) {
    if (card.user_details.already_watched) {
      Сounter.watched++;
      Сounter.total_runtime += card.film_info.runtime;
      for (const genreName of card.film_info.genre) {
        if (genreName in Сounter.genre) {
          Сounter.genre[genreName]++;
        } else {
          Сounter.genre[genreName] = 1;
        }
      }
    }
  }
  let maxValue = 0;
  let maxKey = 0;
  for (const genreName of Object.keys(Сounter.genre)) {
    if (Сounter.genre[genreName] > maxValue) {
      maxValue = Сounter.genre[genreName];
      maxKey = genreName;
    }
    Сounter.top_genre = maxKey;
  }
  return Сounter;
};

render(statisticSection.getElement(), new StatisticText(countStatistic()).getElement(), RenderPosition.BEFOREEND);
render(footerStatisticsElement, new FooterStats(FILMS_NUMBER).getElement(), RenderPosition.BEFOREEND);
