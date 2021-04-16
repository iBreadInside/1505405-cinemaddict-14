import dayjs from 'dayjs';
import { checkPlural, formatingRuntime } from '../utils/common';
import AbstractView from './abstract';

const CARD_DESCRIPTION_LENGTH = 140;

const createFilmCard = (filmCard) => {
  const {comments, film_info, user_details} = filmCard;

  const descriptionReduction = () => {
    if (film_info.description.length > CARD_DESCRIPTION_LENGTH) {
      return `${film_info.description.slice(0, CARD_DESCRIPTION_LENGTH - 1)}...`;
    } else {
      return film_info.description;
    }
  };

  return `<article class="film-card">
    <h3 class="film-card__title">${film_info.title}</h3>
    <p class="film-card__rating">${film_info.total_rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${dayjs(film_info.release.date).year()}</span>
      <span class="film-card__duration">${formatingRuntime(film_info.runtime,'h','m').hours}${formatingRuntime(film_info.runtime,'h','m').minutes}</span>
      <span class="film-card__genre">${film_info.genre[0]}</span>
    </p>
    <img src="${film_info.poster}" alt="${film_info.title} poster" class="film-card__poster">
    <p class="film-card__description">${descriptionReduction()}</p>
    <a class="film-card__comments">${comments.length} ${checkPlural('comment', comments)}</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${user_details.watchlist ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${user_details.already_watched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${user_details.favorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard extends AbstractView{
  constructor(filmCard) {
    super();
    this._filmCard = filmCard;
    this._popupOpenHandler = this._popupOpenHandler.bind(this);
  }

  getTemplate() {
    return createFilmCard(this._filmCard);
  }

  _popupOpenHandler() {
    this._callback.click();
  }

  setPopupOpenHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._popupOpenHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._popupOpenHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._popupOpenHandler);
  }
}
