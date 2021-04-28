import { updateItem } from '../utils/common';
import { remove, render, RenderPosition, replace, SortType, compareRating, compareCommentsNumber, compareFilmDate } from '../utils/render';
import EmptyFilmSection from '../view/empty-film-list';
import FilmsSection from '../view/films-section';
import MainNavigation from '../view/main-navigation';
import ShowMoreButton from '../view/show-more-button';
import SortMenuView from '../view/sort';
import MoviePresenter from './movie';

const FILMS_IN_LINE = 5;
const FILMS_IN_EXTRAS = 2;

const FilmListType = {
  MAIN: 'MAIN',
  TOP_RANK: 'TOP_RANK',
  MOST_COMMENTED: 'MOST_COMMENTED',
};

export default class MovieListPresenter {
  constructor(listContainer) {
    this._listContainer = listContainer;
    this._renderedFilmCount = FILMS_IN_LINE;

    this._moviePresenter = {
      MAIN: {},
      TOP_RANK: {},
      MOST_COMMENTED: {},
    };

    this._filters = null;
    this._currentSortType = SortType.DEFAULT;

    this._filmSectionComponent = new FilmsSection();
    this._emptyListComponent = new EmptyFilmSection();
    this._sortMenuComponent = new SortMenuView();
    this._showMoreBtnComponent = new ShowMoreButton();
    this._mainElement = document.querySelector('.main');
    this._filmListElement = this._filmSectionComponent.getElement().querySelector('.films-list__container');

    this._handleMovieUpdate = this._handleMovieUpdate.bind(this);
    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(filmList, commentsList) {
    this._filmList = filmList.slice();
    this._comments = commentsList.slice();

    this._sourcedFilmList = filmList.slice();

    render(this._listContainer, this._filmSectionComponent, RenderPosition.BEFOREEND);

    this._renderSortMenu();
    this._renderFilters();
    this._renderFilmList();
    this._renderExtras();
  }

  _handleMovieUpdate(updatedFilmCard) {
    this._filmList = updateItem(this._filmList, updatedFilmCard);

    if (this._moviePresenter.MAIN[updatedFilmCard.id]) {
      this._moviePresenter.MAIN[updatedFilmCard.id].init(updatedFilmCard);
    }

    if (this._moviePresenter.TOP_RANK[updatedFilmCard.id]) {
      this._moviePresenter.TOP_RANK[updatedFilmCard.id].init(updatedFilmCard);
    }

    if (this._moviePresenter.MOST_COMMENTED[updatedFilmCard.id]) {
      this._moviePresenter.MOST_COMMENTED[updatedFilmCard.id].init(updatedFilmCard);
    }

    this._renderFilters();
  }

  _renderFilters() {
    // Отрисовка фильтров в mainNavigation
    const prevFiltersComponent = this._filters;

    const countFilters = () => {
      const counter = {
        watchlist: 0,
        history: 0,
        favorites: 0,
      };
      for (const card of this._filmList) {
        if (card.user_details.watchlist) counter.watchlist++;
        if (card.user_details.already_watched) counter.history++;
        if (card.user_details.favorite) counter.favorites++;
      }
      return counter;
    };

    this._filters = new MainNavigation(countFilters());

    if (prevFiltersComponent === null) {
      render(this._mainElement, this._filters, RenderPosition.AFTERBEGIN);
      return;
    }

    if (this._mainElement.contains(prevFiltersComponent.getElement())) {
      replace(this._filters, prevFiltersComponent);
    }

    remove(prevFiltersComponent);
  }

  _sortFilmList(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._filmList.sort(compareFilmDate);
        break;
      case SortType.RATING:
        this._filmList.sort(compareRating);
        break;
      default:
        this._filmList = this._sourcedFilmList.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilmList(sortType);
    this._clearFilmList();
    this._renderFilmList();
  }

  _renderSortMenu() {
    render(this._mainElement, this._sortMenuComponent, RenderPosition.AFTERBEGIN);
    this._sortMenuComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmCard(filmCard, listContainer, filmListType) {
    const moviePresenter = new MoviePresenter(listContainer, this._comments, this._handleMovieUpdate);
    moviePresenter.init(filmCard, this._filmList);

    switch (filmListType) {
      case FilmListType.MAIN:
        this._moviePresenter[filmListType][filmCard.id] = moviePresenter;
        break;
      case FilmListType.TOP_RANK:
        this._moviePresenter[filmListType][filmCard.id] = moviePresenter;
        break;
      case FilmListType.MOST_COMMENTED:
        this._moviePresenter[filmListType][filmCard.id] = moviePresenter;
        break;
    }
  }

  _renderFilmCards(from, to, list, listContainer, filmListType) {
    // Отрисовка нескольких карточек фильмов
    list
      .slice(from, to)
      .forEach((filmCard) => this._renderFilmCard(filmCard, listContainer, filmListType));
  }

  _renderExtras() {
    const topRatedList = this._filmList.slice().sort(compareRating);
    const topRatedContainer = this._filmSectionComponent.getElement().querySelector('.films-list__container--top-rated');
    const mostCommentedList = this._filmList.slice().sort(compareCommentsNumber);
    const mostCommentedContainer = this._filmSectionComponent.getElement().querySelector('.films-list__container--most-commented');

    this._renderFilmCards(0, FILMS_IN_EXTRAS, topRatedList, topRatedContainer, FilmListType.TOP_RANK);
    this._renderFilmCards(0, FILMS_IN_EXTRAS, mostCommentedList, mostCommentedContainer, FilmListType.MOST_COMMENTED);
  }

  _renderEmptyList() {
    // Отрисовка пустого списка фильмов
    render(this._mainElement, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreBtnClick() {
    this._renderFilmCards(this._renderedFilmCount, this._renderedFilmCount + FILMS_IN_LINE, this._filmList, this._filmListElement, FilmListType.MAIN);
    this._renderedFilmCount += FILMS_IN_LINE;

    if (this._renderedFilmCount >= this._filmList.length) {
      remove(this._showMoreBtnComponent);
    }
  }

  _renderShowMoreBtn() {
    if (this._filmList.length > FILMS_IN_LINE) {
      render(this._filmSectionComponent.getElement().querySelector('.films-list'), this._showMoreBtnComponent, RenderPosition.BEFOREEND);
      this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);
    }
  }

  _clearFilmList() {
    Object
      .values(this._moviePresenter.MAIN)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter.MAIN = {};
    this._renderedFilmCount = FILMS_IN_LINE;
    remove(this._showMoreBtnComponent);
  }

  _renderFilmList() {
    // Отрисовка списка фильмов
    if (this._filmList.length === 0) {
      this._renderEmptyList();
      return;
    }

    this._renderFilmCards(0, Math.min(this._filmList.length, FILMS_IN_LINE), this._filmList, this._filmListElement, FilmListType.MAIN);

    if (this._filmList.length > FILMS_IN_LINE) {
      this._renderShowMoreBtn();
    }
  }
}
