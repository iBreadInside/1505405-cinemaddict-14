import { remove, render, RenderPosition, SortType, compareRating, compareCommentsNumber, compareFilmDate } from '../utils/render';
import EmptyFilmSection from '../view/empty-film-list';
import FilmsSection from '../view/films-section';
import ShowMoreButton from '../view/show-more-button';
import SortMenuView from '../view/sort';
import MoviePresenter from './movie';
import { UpdateType } from '../const.js';
import { filter } from '../utils/common.js';

const FILMS_IN_LINE = 5;
const FILMS_IN_EXTRAS = 2;

const FilmListType = {
  MAIN: 'MAIN',
  TOP_RAITING: 'TOP_RAITING',
  MOST_COMMENTED: 'MOST_COMMENTED',
};

export default class MovieListPresenter {
  constructor(listContainer, filmsModel, filterModel) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._listContainer = listContainer;
    this._renderedFilmCount = FILMS_IN_LINE;

    this._moviePresenter = {
      MAIN: {},
      TOP_RAITING: {},
      MOST_COMMENTED: {},
    };

    this._currentSortType = SortType.DEFAULT;

    this.__sortMenuComponent = null;
    this._showMoreBtnComponent = null;

    this._filmSectionComponent = new FilmsSection();
    this._emptyListComponent = new EmptyFilmSection();
    this._mainElement = document.querySelector('.main');
    this._filmListElement = this._filmSectionComponent.getElement().querySelector('.films-list__container');

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handlePopupMode = this._handlePopupMode.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init(commentsList) {
    this._comments = commentsList.slice();

    this._renderFilmBoard();
    this._renderExtras();

  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();

    const filteredFilms = filter[filterType](films);

    // Сортировка
    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(compareFilmDate);
      case SortType.RATING:
        return filteredFilms.sort(compareRating);
    }

    return filteredFilms;
  }

  // Методы для обновлений
  // Обработка действий на представлении
  _handleViewAction(updateType, update) {
    this._filmsModel.updateFilm(updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать (его нет, у нас действие одно)
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  }

  // Уведомление презентера об изменениях
  _handleModelEvent(updateType, data) {
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      // - обновить часть списка (например, когда добавили в избранное)
      case UpdateType.PATCH:
        if (this._moviePresenter.MAIN[data.id]) {
          this._moviePresenter.MAIN[data.id].init(data);
        }

        if (this._moviePresenter.TOP_RAITING[data.id]) {
          this._moviePresenter.TOP_RAITING[data.id].init(data);
        }

        if (this._moviePresenter.MOST_COMMENTED[data.id]) {
          this._moviePresenter.MOST_COMMENTED[data.id].init(data);
        }
        break;
      // - обновить список (например, когда произошла сортировка)
      case UpdateType.MINOR:
        this._clearFilmsBoard();
        this._renderFilmBoard();
        if (this._moviePresenter.TOP_RAITING[data.id]) {
          this._moviePresenter.TOP_RAITING[data.id].init(data);
        }

        if (this._moviePresenter.MOST_COMMENTED[data.id]) {
          this._moviePresenter.MOST_COMMENTED[data.id].init(data);
        }
        break;
      // - обновить всю доску (например, при переключении фильтра)
      case UpdateType.MAJOR:
        this._clearFilmsBoard({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderFilmBoard();
        break;
    }
  }

  _handlePopupMode() {
    Object
      .values(this._moviePresenter.MAIN)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsBoard({resetRenderedFilmsCount: true});
    this._renderFilmBoard();
  }

  _renderSortMenu() {
    if (this._sortMenuComponent !== null) {
      this._sortMenuComponent = null;
    }

    this._sortMenuComponent = new SortMenuView(this._currentSortType);
    this._sortMenuComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._mainElement, this._sortMenuComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmCard(filmCard, listContainer, filmListType) {
    const moviePresenter = new MoviePresenter(listContainer, this._comments, this._handleViewAction, this._handlePopupMode);
    moviePresenter.init(filmCard);

    switch (filmListType) {
      case FilmListType.MAIN:
        this._moviePresenter[filmListType][filmCard.id] = moviePresenter;
        break;
      case FilmListType.TOP_RAITING:
        this._moviePresenter[filmListType][filmCard.id] = moviePresenter;
        break;
      case FilmListType.MOST_COMMENTED:
        this._moviePresenter[filmListType][filmCard.id] = moviePresenter;
        break;
    }
  }

  _renderFilmCards(films, listContainer, filmListType) {
    films.forEach((film) => this._renderFilmCard(film, listContainer, filmListType));
  }

  _renderExtras() {
    const topRatedList = this._getFilms().slice().sort(compareRating).slice(0, FILMS_IN_EXTRAS);
    const topRatedContainer = this._filmSectionComponent.getElement().querySelector('.films-list__container--top-rated');
    const mostCommentedList = this._getFilms().slice().sort(compareCommentsNumber).slice(0, FILMS_IN_EXTRAS);
    const mostCommentedContainer = this._filmSectionComponent.getElement().querySelector('.films-list__container--most-commented');

    this._renderFilmCards(topRatedList, topRatedContainer, FilmListType.TOP_RAITING);
    this._renderFilmCards(mostCommentedList, mostCommentedContainer, FilmListType.MOST_COMMENTED);
  }

  _renderEmptyList() {
    // Отрисовка пустого списка фильмов
    render(this._mainElement, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreBtnClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILMS_IN_LINE);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilmCards(films, this._filmListElement, FilmListType.MAIN);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreBtnComponent);
    }
  }

  _renderShowMoreBtn() {
    if (this._showMoreBtnComponent !== null) {
      this._showMoreBtnComponent = null;
    }

    this._showMoreBtnComponent = new ShowMoreButton();
    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);
    render(this._filmSectionComponent.getElement().querySelector('.films-list'), this._showMoreBtnComponent, RenderPosition.BEFOREEND);
  }

  // Очищение доски
  _clearFilmsBoard({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;
    Object
      .values(this._moviePresenter.MAIN)
      .forEach((presenter) => presenter.destroy());
    // Object
    //   .values(this._moviePresenter.TOP_RAITING)
    //   .forEach((presenter) => presenter.destroy());
    // Object
    //   .values(this._moviePresenter.MOST_COMMENTED)
    //   .forEach((presenter) => presenter.destroy());
    this._moviePresenter.MAIN = {};

    remove(this._emptyListComponent);
    remove(this._sortMenuComponent);
    remove(this._showMoreBtnComponent);

    if (resetRenderedFilmsCount) {
      this._renderedFilmCount = FILMS_IN_LINE;
    } else {
      this._renderedFilmCount = Math.min(filmsCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  // Отрисовка доски
  _renderFilmBoard() {
    const filmCount = this._getFilms().length;

    if (filmCount === 0) {
      this._renderEmptyList();
      return;
    }

    this._renderSortMenu();

    render(this._listContainer, this._filmSectionComponent, RenderPosition.BEFOREEND);

    const films = this._getFilms().slice(0, Math.min(filmCount, FILMS_IN_LINE));

    this._renderFilmCards(films, this._filmListElement, FilmListType.MAIN);

    if (filmCount > FILMS_IN_LINE) {
      this._renderShowMoreBtn();
    }
  }
}
