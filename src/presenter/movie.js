import { remove, render, RenderPosition } from '../utils/render';
import Comment from '../view/comment';
import FilmCard from '../view/film-card';
import FilmDetails from '../view/film-details';

export default class MoviePresenter {
  constructor(filmListContainer, commentsList) {
    this._filmListContainer = filmListContainer;
    this._comments = commentsList.slice();

    this._filmCardComponent = null;

    this._siteBodyElement = document.body;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._closeBtnHandler = this._closeBtnHandler.bind(this);
  }

  init(filmCard, filmList) {
    this._filmCard = filmCard;
    this._filmList = filmList;
    this._filmPopup = new FilmDetails(this._filmList[0]);
    this._comment = new Comment(this._comments[0]);

    this._filmCardComponent = new FilmCard(filmCard);

    render(this._filmListContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
    this._filmCardComponent.setPopupOpenHandler(() => {
      this._renderFilmPopup();
    });
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      remove(this._filmPopup);
      this._siteBodyElement.classList.toggle('hide-overflow');
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _closeBtnHandler() {
    this._siteBodyElement.classList.toggle('hide-overflow');
    remove(this._filmPopup);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _renderFilmPopup() {
    this._siteBodyElement.appendChild(this._filmPopup.getElement());
    this._siteBodyElement.classList.toggle('hide-overflow');

    render(this._filmPopup.getElement().querySelector('.film-details__comments-list'), this._comment, RenderPosition.BEFOREEND);

    document.addEventListener('keydown', this._escKeyDownHandler);
    this._filmPopup.setCloseBtnClickHandler(this._closeBtnHandler);
  }
}
