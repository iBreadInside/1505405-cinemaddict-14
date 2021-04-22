import { remove, render, RenderPosition } from '../utils/render';
import Comment from '../view/comment';
import EmptyFilmSection from '../view/empty-film-list';
import FilmCard from '../view/film-card';
import FilmDetails from '../view/film-details';
import FilmsSection from '../view/films-section';
import MainNavigation from '../view/main-navigation';
import ShowMoreButton from '../view/show-more-button';

const FILMS_IN_LINE = 5;
const FILMS_IN_EXTRAS = 2;

export default class MovieListPresenter {
  constructor(listContainer) {
    this._listContainer = listContainer;
    this._renderedFilmCount = FILMS_IN_LINE;

    this._filmSectionComponent = new FilmsSection();
    this._emptyListComponent = new EmptyFilmSection();
    this._showMoreBtnComponent = new ShowMoreButton();
    this._mainElement = document.querySelector('.main');
    this._filmListElement = this._filmSectionComponent.getElement().querySelector('.films-list__container');

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
  }

  init(filmList, commentsList) {
    this._filmList = filmList.slice();
    this._comments = commentsList.slice();

    render(this._listContainer, this._filmSectionComponent, RenderPosition.BEFOREEND);

    this._renderFilmList();
    this._renderExtras();
  }

  _renderNav() {
    // Отрисовка фильтров в mainNavigation
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
    render(this._mainElement, new MainNavigation(countFilters()), RenderPosition.AFTERBEGIN);
  }

  _renderFilmCard(filmCard, listContainer) {
    // Отрисовка карточки фильма
    const filmCardComponent = new FilmCard(filmCard);
    render(listContainer, filmCardComponent, RenderPosition.BEFOREEND);
    filmCardComponent.setPopupOpenHandler(() => {
      this._renderFilmPopup();
    });
  }

  _renderFilmCards(from, to, list, listContainer) {
    // Отрисовка нескольких карточек фильмов
    list
      .slice(from, to)
      .forEach((filmCard) => this._renderFilmCard(filmCard, listContainer));
  }

  _renderExtras() {
    // Отрисовка блока Extras
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

    const topRatedList = this._filmList.sort(compareRating).slice(0, FILMS_IN_EXTRAS);
    const topRatedContainer = this._filmSectionComponent.getElement().querySelector('.films-list__container--top-rated');
    const mostCommentedList = this._filmList.sort(compareCommentsNumber).slice(0, FILMS_IN_EXTRAS);
    const mostCommentedContainer = this._filmSectionComponent.getElement().querySelector('.films-list__container--most-commented');

    this._renderFilmCards(0, FILMS_IN_EXTRAS, topRatedList, topRatedContainer);
    this._renderFilmCards(0, FILMS_IN_EXTRAS, mostCommentedList, mostCommentedContainer);
  }

  _renderFilmPopup() {
    const filmPopup = new FilmDetails(this._filmList[0]);
    const siteBodyElement = document.body;

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        remove(filmPopup);
        siteBodyElement.classList.toggle('hide-overflow');
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    siteBodyElement.appendChild(filmPopup.getElement());
    siteBodyElement.classList.toggle('hide-overflow');

    render(filmPopup.getElement().querySelector('.film-details__comments-list'), new Comment(this._comments[0]).getElement(), RenderPosition.BEFOREEND);

    document.addEventListener('keydown', onEscKeyDown);
    filmPopup.setCloseBtnClickHandler(() => {
      siteBodyElement.classList.toggle('hide-overflow');
      remove(filmPopup);
      document.removeEventListener('keydown', onEscKeyDown);
    });
  }

  _renderEmptyList() {
    // Отрисовка пустого списка фильмов
    render(this._mainElement, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreBtnClick() {
    this._renderFilmCards(this._renderedFilmCount, this._renderedFilmCount + FILMS_IN_LINE, this._filmList, this._filmListElement);
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

  _renderFilmList() {
    // Отрисовка списка фильмов
    if (this._filmList.length === 0) {
      this._renderEmptyList();
      return;
    }

    this._renderNav();

    this._renderFilmCards(0, Math.min(this._filmList.length, FILMS_IN_LINE), this._filmList, this._filmListElement);

    if (this._filmList.length > FILMS_IN_LINE) {
      this._renderShowMoreBtn();
    }
  }
}
