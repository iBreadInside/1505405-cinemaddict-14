import { render, remove }  from '../utils/render.js';
import { SortType, compareRating, compareCommentsNumber, compareFilmDate } from '../utils/render.js';
import { UpdateType, UserAction } from '../const.js';
import { filter } from '../utils/common.js';
import LoadingView from '../view/loading.js';

import MoviePresenter from './movie.js';
import EmptyFilmSection from '../view/empty-film-list.js';
import FilmsContainerView from '../view/film-container.js';
import FilmListView from '../view/film-list.js';
import ExtraFilmListView from '../view/film-extra.js';
import SortMenuView from '../view/sort.js';
import showMoreBtn from '../view/show-more-button.js';

const FILMS_IN_EXTRAS = 2;
const FILMS_IN_LINE = 5;
const MOST_COMMENTED_TITLE = 'Most commented';

export default class MovieListPresenter {
  constructor(container, moviesModel, filterModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;

    this._emptyListComponent = new EmptyFilmSection();
    this._filmsContainerComponent = new FilmsContainerView();
    this._filmsListComponent = new FilmListView();
    this._extraFilmsListComponent = new ExtraFilmListView();
    this._loadingComponent = new LoadingView();

    this._showMoreBtnComponent = null;
    this._sortingComponent = null;
    this._extraMostCommentedComponent = null;
    this._filmsListContainer = null;
    this._topRatedContainer = null;
    this._mostCommentedContainer = null;
    this._mainElement = document.querySelector('.main');

    this._currentSortType = SortType.DEFAULT;
    this._renderedFilmCount = FILMS_IN_LINE;
    this._isLoading = true;
    this._api = api;

    this._mainPresenter = {};
    this._topRatedPresenter = {};
    this._mostCommentedPresenter = {};

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handlePopupMode = this._handlePopupMode.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderBoard();
  }

  _getMovies() {
    const filterType = this._filterModel.get();
    const movies = this._moviesModel.get().slice();
    const filteredMovies = filter[filterType](movies);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredMovies.sort(compareFilmDate);
      case SortType.RATING:
        return filteredMovies.sort(compareRating);
    }

    return filteredMovies;
  }

  _renderLoading() {
    render(this._mainElement, this._loadingComponent);
  }

  _renderSort() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortMenuView(this._currentSortType);
    render(this._mainElement, this._sortingComponent);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderMovie(container, id) {
    const moviePresenter = new MoviePresenter(container, this._handleViewAction, this._handlePopupMode, id, this._moviesModel, this._api);
    moviePresenter.init();

    return moviePresenter;
  }

  _renderMainMovieList() {
    const movieCount = this._getMovies().length;
    const movies = this._getMovies().slice(0, Math.min(movieCount, this._renderedFilmCount));

    movies.forEach((movie) => {
      const presenter = this._renderMovie(this._filmsListContainer, movie.id);
      this._mainPresenter[movie.id] = presenter;
    });

    if (movieCount > this._renderedFilmCount) {
      this._renderShowMoreBtn();
    }
  }

  _renderShowMoreBtn() {
    if (this._showMoreBtnComponent !== null) {
      this._showMoreBtnComponent = null;
    }

    this._showMoreBtnComponent = new showMoreBtn();
    render(this._filmsListComponent, this._showMoreBtnComponent);

    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);
  }

  _renderTopRatedList() {
    const movies = this._moviesModel.get().slice();
    const moviesWithRating = movies.filter((movie) => movie.filmInfo.totalRating > 0);

    if (!moviesWithRating.length) {
      return;
    }

    render(this._filmsContainerComponent, this._extraFilmsListComponent);
    this._topRatedContainer = this._extraFilmsListComponent.getFilmsListContainer();

    moviesWithRating
      .filter((movie) => movie.filmInfo.totalRating)
      .sort(compareRating)
      .slice(0, FILMS_IN_EXTRAS)
      .forEach((movie) => {
        const presenter = this._renderMovie(this._topRatedContainer, movie.id);
        this._topRatedPresenter[movie.id] = presenter;
      });
  }

  _renderMostCommentedList() {
    const movies = this._moviesModel.get().slice();
    const moviesWithComments = movies.filter((movie) => movie.comments.length > 0);

    if (!moviesWithComments.length) {
      return;
    }

    this._extraMostCommentedComponent = new ExtraFilmListView(MOST_COMMENTED_TITLE);
    render(this._filmsContainerComponent, this._extraMostCommentedComponent);

    this._mostCommentedContainer = this._extraMostCommentedComponent.getFilmsListContainer();

    moviesWithComments
      .sort(compareCommentsNumber)
      .slice(0, FILMS_IN_EXTRAS)
      .forEach((movie) => {
        const presenter = this._renderMovie(this._mostCommentedContainer, movie.id);
        this._mostCommentedPresenter[movie.id] = presenter;
      });
  }

  _renderEmptyList() {
    render(this._mainElement, this._emptyListComponent);
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();

      return;
    }

    const moviesCount = this._getMovies().length;

    if (moviesCount === 0) {
      this._renderEmptyList();

      return;
    }

    this._renderSort();
    render(this._mainElement, this._filmsContainerComponent);
    render(this._filmsContainerComponent, this._filmsListComponent);

    this._filmsListContainer = this._filmsListComponent.getFilmsListContainer();
    this._renderMainMovieList();
    this._renderTopRatedList();
    this._renderMostCommentedList();
  }

  _clearMovieList({resetRenderedMovieCount = false, resetSortType = false} = {}) {
    const movieCount = this._getMovies().length;

    const presenters = [
      ...Object.values(this._mainPresenter),
      ...Object.values(this._topRatedPresenter),
      ...Object.values(this._mostCommentedPresenter),
    ];

    presenters.forEach((presenter) => presenter.destroy());

    this._mainPresenter = {};
    this._topRatedPresenter = {};
    this._mostCommentedPresenter = {};

    remove(this._showMoreBtnComponent);
    remove(this._filmsContainerComponent);
    remove(this._filmsListComponent);
    remove(this._extraFilmsListComponent);
    remove(this._extraMostCommentedComponent);
    remove(this._emptyListComponent);
    remove(this._sortingComponent);
    remove(this._loadingComponent);

    this._renderedFilmCount = resetRenderedMovieCount
      ? FILMS_IN_LINE
      : Math.min(movieCount, this._renderedFilmCount);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  // _resetPopup(moviePresenter) {
  //   Object
  //     .values(moviePresenter)
  //     .forEach((presenter) => presenter.resetView());
  // }

  show() {
    if (!this._sortingComponent || !this._filmsContainerComponent) {
      return;
    }

    this._sortingComponent.getElement().classList.remove('visually-hidden');
    this._filmsContainerComponent.getElement().classList.remove('visually-hidden');
  }

  hide() {
    if (!this._sortingComponent || !this._filmsContainerComponent) {
      return;
    }

    this._sortingComponent.getElement().classList.add('visually-hidden');
    this._filmsContainerComponent.getElement().classList.add('visually-hidden');
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMovieList({resetRenderedMovieCount: true});
    this._renderBoard();
  }

  _handleShowMoreBtnClick() {
    const movieCount = this._getMovies().length;
    const newRenderedMovieCount = Math.min(movieCount, this._renderedFilmCount + FILMS_IN_LINE);
    const movies = this._getMovies().slice(this._renderedFilmCount, newRenderedMovieCount);

    movies
      .forEach((movie) => {
        const presenter = this._renderMovie(this._filmsListContainer, movie.id);
        this._mainPresenter[movie.id] = presenter;
      });

    this._renderedFilmCount = newRenderedMovieCount;

    if (this._renderedFilmCount >= movieCount) {
      remove(this._showMoreBtnComponent);
    }
  }

  _resetPopup(moviePresenter) {
    Object
      .values(moviePresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handlePopupMode() {
    this._resetPopup(this._mainPresenter);
    this._resetPopup(this._topRatedPresenter);
    this._resetPopup(this._mostCommentedPresenter);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this._api.updateMovie(update)
          .then((response) => {
            this._moviesModel.update(updateType, response, {isNewComment: false});
          })
          .catch(() => {
            if (this._topRatedPresenter[update.id]) {
              this._topRatedPresenter[update.id].setAborting();
            }
            if (this._mostCommentedPresenter[update.id]) {
              this._mostCommentedPresenter[update.id].setAborting();
            }
            if (this._mainPresenter[update.id]) {
              this._mainPresenter[update.id].setAborting();
            }
          });
        break;
      case UserAction.ADD_COMMENT:
        this._api.updateMovie(update)
          .then((response) => {
            this._moviesModel.update(updateType, response, {isNewComment: true});
          });
        break;
    }
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._clearMovieList();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearMovieList({resetRenderedMovieCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }
}
