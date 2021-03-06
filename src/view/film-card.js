import dayjs from 'dayjs';
import AbstractView from './abstract.js';
import { checkPlural, generateFilmRuntime } from '../utils/common';

const CARD_DESCRIPTION_LENGTH = 140;

const isSelectedFilmControl = (isChecked) => isChecked ? 'film-card__controls-item--active' : '';

const createFilmCardTemplate = (movie) => {
  const {comments, filmInfo, userDetails} = movie;

  const descriptionReduction = () => {
    if (filmInfo.description.length > CARD_DESCRIPTION_LENGTH) {
      return `${filmInfo.description.slice(0, CARD_DESCRIPTION_LENGTH - 1)}...`;
    } else {
      return filmInfo.description;
    }
  };

  const movieRuntime = generateFilmRuntime(filmInfo.runtime);
  const watchlistActive = isSelectedFilmControl(userDetails.watchlist);
  const alreadyWatchedtActive = isSelectedFilmControl(userDetails.alreadyWatched);
  const favoriteActive = isSelectedFilmControl(userDetails.favorite);

  return `<article class="film-card">
    <h3 class="film-card__title">${filmInfo.title}</h3>
    <p class="film-card__rating">${filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${dayjs(filmInfo.release.date).year()}</span>
      <span class="film-card__duration">${movieRuntime}</span>
      <span class="film-card__genre">${filmInfo.genre[0]}</span>
    </p>
    <img src="./${filmInfo.poster}" alt="${filmInfo.title} poster" class="film-card__poster">
    <p class="film-card__description">${descriptionReduction()}</p>
    <a class="film-card__comments">${comments.length} ${checkPlural('comment', comments)}</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistActive}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${alreadyWatchedtActive}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteActive}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView extends AbstractView {
  constructor(movie, comments) {
    super();
    this._movie = movie;
    this._comments = comments;
    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._popupOpenHandler = this._popupOpenHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._movie, this._comments);
  }

  _filmCardClickHandler(evt) {
    evt.preventDefault();
    this._callback.filmCardClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _popupOpenHandler() {
    this._callback.click();
  }

  setFilmCardClickHandler(callback, element) {
    this._callback.filmCardClick = callback;
    this.getElement().querySelector(element).addEventListener('click', this._filmCardClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setPopupOpenHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._popupOpenHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._popupOpenHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._popupOpenHandler);
  }
}
