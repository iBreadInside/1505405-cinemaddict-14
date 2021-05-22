import { MenuItem, UpdateType } from './const.js';

import { generateFilmCard } from './mock/film-info.js';
import { generateComments } from './mock/comments.js';
// import {getRandomNumber} from './utils/common.js';

import StatsView from './view/stats.js';

import ProfilePresenter from './presenter/profile-info.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import MovieListPresenter from './presenter/movie-list.js';
import FooterStatsPresenter from './presenter/footer-stats.js';

import MoviesModel from './model/movies.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';
import { remove, render } from './utils/render.js';

const FILMS_NUMBER = 12;
// const COMMENTS_NUMBER = 5;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatsElement = document.querySelector('.footer__statistics');

// const TOTAL_MOVIE_COUNT = 24;
// const MIN_FILM_NUMBER = 100000;
// const MAX_FILM_NUMBER = 150000;

const idArray = Array.from(Array(FILMS_NUMBER).keys());
const comments = idArray.map((id) => generateComments(id));
const movies = idArray.map((id) => generateFilmCard(id));
// const totalMovieCount = getRandomNumber(MIN_FILM_NUMBER, MAX_FILM_NUMBER);

const moviesModel = new MoviesModel();
moviesModel.set(movies);

const commentsModel = new CommentsModel();
commentsModel.set(comments);

const filterModel = new FilterModel();

const profilePresenter = new ProfilePresenter(headerElement, moviesModel);
const siteMenuPresenter = new SiteMenuPresenter(mainElement, filterModel, moviesModel);
const movieListPresenter = new MovieListPresenter(mainElement, moviesModel, commentsModel, filterModel);
const footerStatsPresenter = new FooterStatsPresenter(footerStatsElement, moviesModel, movies.length);

profilePresenter.init();
siteMenuPresenter.init();
movieListPresenter.init();
footerStatsPresenter.init();

let statsComponent = null;

const handleMenuItemClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      filterModel.set(UpdateType.MAJOR, MenuItem.STATS);
      siteMenuPresenter.toggleMenuItem(menuItem);
      statsComponent = new StatsView(moviesModel.get());
      render(mainElement, statsComponent);
      movieListPresenter.hide();
      break;

    default:
      siteMenuPresenter.toggleMenuItem(menuItem);
      remove(statsComponent);
      movieListPresenter.show();
      break;
  }
};

const mainNavigation = document.querySelector('.main-navigation');

mainNavigation.addEventListener('click', (evt) => {
  evt.preventDefault();
  const menuItemType = evt.target.dataset.type;
  handleMenuItemClick(menuItemType);
});
