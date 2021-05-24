import { MenuItem, UpdateType } from './const.js';

import { generateFilmCard } from './mock/film-info.js';
import { generateComments } from './mock/comments.js';

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

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatsElement = document.querySelector('.footer__statistics');

const idArray = Array.from(Array(FILMS_NUMBER).keys());
const comments = idArray.map((id) => generateComments(id));
const movies = idArray.map((id) => generateFilmCard(id));

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
      remove(statsComponent);
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

const mainNav = document.querySelector('.main-navigation');

mainNav.addEventListener('click', (evt) => {
  if (evt.target.closest('a')) {
    evt.preventDefault();
    const menuItemType = evt.target.dataset.type;
    handleMenuItemClick(menuItemType);
  }
});
