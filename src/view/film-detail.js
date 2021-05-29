import dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import he from 'he';
import { checkPlural, formatingRuntime } from '../utils/common';
import Smart from './smart.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const DEFAULT_NEW_COMMENT = {
  comment: '',
  emotion: null,
  date: '',
};

const createCommentTemplate = (filmComment, isDeleting, isDisabled) => {
  const {id, author, comment, date, emotion} = filmComment;

  const getCommentDate = (date) => {
    return dayjs(date).fromNow();
  };

  return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getCommentDate(date)}</span>
          <button type='button' class="film-details__comment-delete" data-id="${id}"${isDisabled ? ' disabled' : ''}>
            ${isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </p>
      </div>
    </li>`;
};

const createFilmDetails = (state, movieComments) => {
  const { comments, filmInfo, userDetails, isDisabled, deletingId, newComment } = state;

  const releaseDate = dayjs(filmInfo.release.date).format('DD MMMM YYYY');
  const runtime = [formatingRuntime(filmInfo.runtime,'h','m').hours, formatingRuntime(filmInfo.runtime,'h','m').minutes].join(' ');

  const movieGenres = filmInfo.genre.length > 2
    ? `${filmInfo.genre.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('')}`
    : `<span class="film-details__genre">${filmInfo.genre[0]}</span>`;

  const commentsList = movieComments
    .sort((a, b) => {
      const date1 = dayjs(a.date);
      const date2 = dayjs(b.date);

      return date1.diff(date2);
    });

  const commentBlock = comments.length
    ? commentsList.map((comment) => createCommentTemplate(comment, comment.id === String(deletingId), isDisabled)).join('')
    : '';

  const {emotion, comment} = newComment;

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${filmInfo.poster}" alt="${filmInfo.title} poster">

            <p class="film-details__age">${filmInfo.ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${filmInfo.title}</h3>
                <p class="film-details__title-original">Original: ${filmInfo.title}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${filmInfo.totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${filmInfo.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${runtime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${checkPlural('Genre', filmInfo.genre)}</td>
                <td class="film-details__cell">${movieGenres}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${filmInfo.description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${userDetails.watchlist ? 'checked' : ''}${isDisabled ? ' disabled' : ''}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${userDetails.alreadyWatched ? 'checked' : ''}${isDisabled ? ' disabled' : ''}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${userDetails.favorite ? 'checked' : ''}${isDisabled ? ' disabled' : ''}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${commentBlock}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${emotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : ''}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"${isDisabled ? ' disabled' : ''}>${he.encode(comment)}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile"${emotion === 'smile' ? ' checked' : ''}${isDisabled ? ' disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping"${emotion === 'sleeping' ? ' checked' : ''}${isDisabled ? ' disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke"${emotion === 'puke' ? ' checked' : ''}${isDisabled ? ' disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry"${emotion === 'angry' ? ' checked' : ''}${isDisabled ? ' disabled' : ''}>
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

export default class FilmDetailsView extends Smart {
  constructor(film, comments) {
    super();
    this._state = FilmDetailsView.parseFilmToState(film);
    this._comments = comments;
    this._updatedComments = null;
    this._closeBtnClickHandler = this._closeBtnClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._documentEnterKeyDownHandler = this._documentEnterKeyDownHandler.bind(this);
    this._changeCommentEmojiHandler = this._changeCommentEmojiHandler.bind(this);
    this._inputNewCommentHandler = this._inputNewCommentHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetails(this._state, this._comments);
  }

  updateNewCommentInput(newComment) {
    const { comment, emotion } = newComment;

    if (!emotion && !comment) {
      return;
    }

    this.updateState({
      newComment: Object.assign(
        {},
        this._state.newComment,
        {
          comment,
          emotion,
        },
      ),
    });
  }

  _closeBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeBtnClick();
  }

  _watchlistClickHandler() {
    const { comment, emotion } = this._state.newComment;

    this._callback.watchlistClick(comment, emotion);

  }

  _watchedClickHandler() {
    const { comment, emotion } = this._state.newComment;

    this._callback.watchedClick(comment, emotion);
  }

  _favoriteClickHandler() {
    const { comment, emotion } = this._state.newComment;

    this._callback.favoriteClick(comment, emotion);
  }

  _formSubmitHandler() {
    if (this._state.isDisabled) {
      return;
    }

    const { comment, emotion } = this._state.newComment;

    if (!comment.trim() || !emotion) {
      return;
    }

    const update = FilmDetailsView.parseStateToComment(this._state);
    this.updateState({
      newComment: Object.assign(
        {},
        this._state.newComment,
        DEFAULT_NEW_COMMENT,
      ),
    }, true);

    this._callback.formSubmit(update);
  }

  _documentEnterKeyDownHandler(evt) {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      this._formSubmitHandler();
    }
  }

  _changeCommentEmojiHandler(evt) {
    evt.preventDefault();

    this.updateState({
      newComment: Object.assign(
        {},
        this._state.newComment,
        {
          emotion: evt.target.value,
        },
      ),
    });
  }

  _inputNewCommentHandler(evt) {
    evt.preventDefault();
    this.updateState({
      newComment: Object.assign(
        {},
        this._state.newComment,
        {
          comment: evt.target.value,
        },
      ),
    }, true);
  }

  _deleteCommentHandler(evt) {
    evt.preventDefault();
    const { comment, emotion } = this._state.newComment;
    const deletedCommentId = +evt.target.dataset.id;
    this._callback.deleteComment(comment, emotion, deletedCommentId);
  }

  setCommentDeleteHandler(callback) {
    this._callback.deleteComment = callback;
    this.getElement()
      .querySelectorAll('.film-details__comment-delete')
      .forEach((item) => item.addEventListener('click', this._deleteCommentHandler));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    document.addEventListener('keydown', this._documentEnterKeyDownHandler);
  }

  setCloseBtnClickHandler(callback) {
    this._callback.closeBtnClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeBtnClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('#favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('#watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('#watched').addEventListener('click', this._watchedClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setCloseBtnClickHandler(this._callback.closeBtnClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCommentDeleteHandler(this._callback.deleteComment);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll('.film-details__emoji-item')
      .forEach((item) => item.addEventListener('change', this._changeCommentEmojiHandler));

    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._inputNewCommentHandler);
  }

  removeHandlers() {
    document.removeEventListener('keydown', this._documentEnterKeyDownHandler);
  }

  // === Static ===

  static parseFilmToState(film) {
    return Object.assign({}, film, {
      newComment: DEFAULT_NEW_COMMENT,
      isDisabled: false,
      deletingId: null,
    });
  }

  static parseStateToComment(state) {
    state = Object.assign({}, state);
    delete state.isDisabled;
    delete state.deletingId;

    return {
      comment: state.newComment.comment,
      emotion: state.newComment.emotion,
      filmId: state.id,
    };
  }
}
