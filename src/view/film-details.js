import dayjs from 'dayjs';
import { checkPlural, formatingRuntime } from '../utils/common';
import AbstractView from './abstract';

const createCellSpans = (checkedValue, term) => {
  const spans = [];
  for (let i = 0; i < checkedValue.length; i++) {
    spans.push(`<span class="film-details__${term}">${checkedValue[i]}</span>`);
  }
  return spans.join('');
};

const createFilmDetails = (filmCard) => {
  const {comments, film_info, user_details} = filmCard;

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${film_info.poster}" alt="${film_info.title} poster">

            <p class="film-details__age">${film_info.age_rating}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${film_info.title}</h3>
                <p class="film-details__title-original">Original: ${film_info.title}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${film_info.total_rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${film_info.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term film-details__term--writers">Writers</td>
                <td class="film-details__cell">${film_info.writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term film-details__term--actors">Actors</td>
                <td class="film-details__cell">${film_info.actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${dayjs(film_info.release.date).format('DD MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formatingRuntime(film_info.runtime,'h','m').hours}${formatingRuntime(film_info.runtime,'h','m').minutes}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${film_info.release.release_country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term film-details__term--genres">${checkPlural('Genre', film_info.genre)}</td>
                <td class="film-details__cell">${createCellSpans(film_info.genre, 'genre')}</td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${film_info.description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${user_details.watchlist ? 'checked' : ''}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${user_details.already_watched ? 'checked' : ''}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${user_details.favorite ? 'checked' : ''}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list"></ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmDetails extends AbstractView {
  constructor(filmCard) {
    super();
    this._filmCard = filmCard;
    this._closeBtnClickHandler = this._closeBtnClickHandler.bind(this);
    this._popupWatchlistHandler = this._popupWatchlistHandler.bind(this);
    this._popupWatchedHandler = this._popupWatchedHandler.bind(this);
    this._popupFavoriteHandler = this._popupFavoriteHandler.bind(this);
  }

  getTemplate() {
    return createFilmDetails(this._filmCard);
  }

  _closeBtnClickHandler() {
    this._callback.click();
  }

  _popupWatchlistHandler() {
    this._callback.popupWatchlistClick(this._filmCard);
  }

  _popupWatchedHandler() {
    this._callback.popupWatchedClick(this._filmCard);
  }

  _popupFavoriteHandler() {
    this._callback.popupFavoriteClick(this._filmCard);
  }

  setCloseBtnClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeBtnClickHandler);
  }

  setPopupWatchlistHandler(callback) {
    this._callback.popupWatchlistClick = callback;
    this.getElement().querySelector('#watchlist').addEventListener('click', this._popupWatchlistHandler);
  }

  setPopupWatchedHandler(callback) {
    this._callback.popupWatchedClick = callback;
    this.getElement().querySelector('#watched').addEventListener('click', this._popupWatchedHandler);
  }

  setPopupFavoriteHandler(callback) {
    this._callback.popupFavoriteClick = callback;
    this.getElement().querySelector('#favorite').addEventListener('click', this._popupFavoriteHandler);
  }
}
