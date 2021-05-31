import { MenuItem, UpdateType } from './const.js';

import StatsView from './view/stats.js';

import ProfilePresenter from './presenter/profile-info.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import MovieListPresenter from './presenter/movie-list.js';
import FooterStatsPresenter from './presenter/footer-stats.js';

import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';
import { remove, render } from './utils/render.js';

import Api from './api.js';

const AUTHORIZATION = 'Basic Nekro991';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatsElement = document.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();

const profilePresenter = new ProfilePresenter(headerElement, moviesModel);
const siteMenuPresenter = new SiteMenuPresenter(mainElement, filterModel, moviesModel);
const movieListPresenter = new MovieListPresenter(mainElement, moviesModel, filterModel, api);
const footerStatsPresenter = new FooterStatsPresenter(footerStatsElement, moviesModel);

siteMenuPresenter.init();
movieListPresenter.init();

let statsComponent = null;

const renderBoardMenu = () => {
  profilePresenter.init();
  footerStatsPresenter.init();

  siteMenuPresenter.getMainNavContainer()
    .addEventListener('click', siteMenuClickHandler);
};

const siteMenuClickHandler = (evt) => {
  if (evt.target.closest('a')) {
    evt.preventDefault();
    const menuItemType = evt.target.dataset.type;
    handleMenuItemClick(menuItemType);
  }
};

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

api.getMovies()
  .then((movies) => {
    moviesModel.set(UpdateType.INIT, movies);
    renderBoardMenu();
  })
  .catch(() => {
    moviesModel.set(UpdateType.INIT, []);
    renderBoardMenu();
  });
