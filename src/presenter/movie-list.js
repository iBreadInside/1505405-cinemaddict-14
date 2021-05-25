import {render, remove}  from '../utils/render.js';
import { SortType, compareRating, compareCommentsNumber, compareFilmDate} from '../utils/render.js';
import { UpdateType, UserAction} from '../const.js';
import {filter} from '../utils/common.js';

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
  constructor(container, moviesModel, commentsModel, filterModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._emptyListComponent = new EmptyFilmSection();
    this._filmsContainerComponent = new FilmsContainerView();
    this._filmsListComponent = new FilmListView();
    this._extraFilmsListComponent = new ExtraFilmListView();
    this._showMoreBtnComponent = null;
    this._sortingComponent = null;
    this._extraMostCommentedFilmsListComponent = null;
    this._filmsListContainer = null;
    this._topRatedListContainer = null;
    this._mostCommentedContainer = null;
    this._mainElement = document.querySelector('.main');

    this._currentSortType = SortType.DEFAULT;
    this._renderedFilmCount = FILMS_IN_LINE;

    this._filmCardPresenter = {};
    this._topRatedFilmCardPresenter = {};
    this._mostCommentedFilmCardPresenter = {};

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderGeneralMoviesList();
  }

  _getMovies() {
    const filterType = this._filterModel.get();
    const movies = this._moviesModel.get().slice();
    const filtredMovies = filter[filterType](movies);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredMovies.sort(compareFilmDate);
      case SortType.RATING:
        return filtredMovies.sort(compareRating);
    }

    return filtredMovies;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this._moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.UPDATE_COMMENTS:
        this._commentsModel.update(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._clearMovieList();
        this._renderGeneralMoviesList();
        break;
      case UpdateType.MAJOR:
        this._clearMovieList({resetRenderedMovieCount: true, resetSortType: true});
        this._renderGeneralMoviesList();
        break;
    }
  }

  _renderSort() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortMenuView(this._currentSortType);
    render(this._mainElement, this._sortingComponent);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMovieList({resetRenderedMovieCount: true});
    this._renderGeneralMoviesList();
  }

  _renderMovie(film, container, id) {
    const moviePresenter = new MoviePresenter(container, this._handleViewAction, id, this._commentsModel, this._moviesModel, this._filterModel);
    moviePresenter.init(film);

    return moviePresenter;
  }

  _renderRegularMovieList() {
    const movieCount = this._getMovies().length;
    const movies = this._getMovies().slice(0, Math.min(movieCount, this._renderedFilmCount));

    movies.forEach((movie) => {
      const presenter = this._renderMovie(movie, this._filmsListContainer, movie.id);
      this._filmCardPresenter[movie.id] = presenter;
    });

    if (movieCount > this._renderedFilmCount) {
      this._rendershowMoreBtn();
    }
  }

  _rendershowMoreBtn() {
    if (this._showMoreBtnComponent !== null) {
      this._showMoreBtnComponent = null;
    }

    this._showMoreBtnComponent = new showMoreBtn();
    render(this._filmsListComponent, this._showMoreBtnComponent);

    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);
  }

  _handleShowMoreBtnClick() {
    const movieCount = this._getMovies().length;
    const newRenderedMovieCount = Math.min(movieCount, this._renderedFilmCount + FILMS_IN_LINE);
    const movies = this._getMovies().slice(this._renderedFilmCount, newRenderedMovieCount);

    movies
      .forEach((movie) => {
        const presenter = this._renderMovie(movie, this._filmsListContainer, movie.id);
        this._filmCardPresenter[movie.id] = presenter;
      });

    this._renderedFilmCount = newRenderedMovieCount;

    if (this._renderedFilmCount >= movieCount) {
      remove(this._showMoreBtnComponent);
    }
  }

  _renderTopRatedList() {
    const movies = this._getMovies();
    render(this._filmsContainerComponent, this._extraFilmsListComponent);
    this._topRatedListContainer = this._extraFilmsListComponent.getElement().querySelector('.films-list--extra .films-list__container');

    movies
      .filter((movie) => movie.filmInfo.totalRating)
      .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
      .slice(0, FILMS_IN_EXTRAS)
      .forEach((movie) => {
        const presenter = this._renderMovie(movie, this._topRatedListContainer, movie.id);
        this._topRatedFilmCardPresenter[movie.id] = presenter;
      });
  }

  _renderMostCommentedList() {
    const moviesWithComments = this._getMovies().filter((movie) => movie.comments.length > 0);

    this._extraMostCommentedFilmsListComponent = new ExtraFilmListView(MOST_COMMENTED_TITLE);
    render(this._filmsContainerComponent, this._extraMostCommentedFilmsListComponent);

    if (!moviesWithComments.length) {
      return;
    }

    this._mostCommentedContainer = this._extraMostCommentedFilmsListComponent.getElement().querySelector('.films-list--extra .films-list__container');

    moviesWithComments
      .sort(compareCommentsNumber)
      .slice(0, FILMS_IN_EXTRAS)
      .forEach((movie) => {
        const presenter = this._renderMovie(movie, this._mostCommentedContainer, movie.id);
        this._mostCommentedFilmCardPresenter[movie.id] = presenter;
      });
  }

  _clearMovieList({resetRenderedMovieCount = false, resetSortType = false} = {}) {
    const movieCount = this._getMovies().length;

    const presenters = [
      ...Object.values(this._filmCardPresenter),
      ...Object.values(this._topRatedFilmCardPresenter),
      ...Object.values(this._mostCommentedFilmCardPresenter),
    ];

    presenters.forEach((presenter) => presenter.destroy());

    this._filmCardPresenter = {};
    this._topRatedFilmCardPresenter = {};
    this._mostCommentedFilmCardPresenter = {};

    remove(this._showMoreBtnComponent);
    remove(this._filmsContainerComponent);
    remove(this._filmsListComponent);
    remove(this._extraFilmsListComponent);
    remove(this._extraMostCommentedFilmsListComponent);
    remove(this._emptyListComponent);
    remove(this._sortingComponent);

    if (resetRenderedMovieCount) {
      this._renderedFilmCount = FILMS_IN_LINE;
    } else {
      this._renderedFilmCount = Math.min(movieCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

  }

  _renderEmptyList() {
    render(this._mainElement, this._emptyListComponent);
  }

  _renderGeneralMoviesList() {
    const moviesCount = this._getMovies().length;

    if (moviesCount === 0) {
      this._renderEmptyList();

      return;
    }

    this._renderSort();
    render(this._mainElement, this._filmsContainerComponent);
    render(this._filmsContainerComponent, this._filmsListComponent);

    this._filmsListContainer = document.querySelector('.films-list__container');
    this._renderRegularMovieList();
    this._renderTopRatedList();
    this._renderMostCommentedList();
  }

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
}
