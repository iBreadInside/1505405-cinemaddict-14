import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-detail.js';
import { render, remove, replace }  from '../utils/render.js';
import { UserAction, UpdateType, State } from '../const.js';
import dayjs from 'dayjs';

const PopupStatus = {
  CLOSE: 'CLOSE',
  OPEN: 'OPEN',
};

export default class MoviePresenter {
  constructor(container, changeData, id, moviesModel, api) {
    this._container = container;
    this._changeData = changeData;
    this._id = id;
    this._moviesModel = moviesModel;

    this._filmCardComponent = null;
    this._filmPopup = null;
    this._popupStatus = PopupStatus.CLOSE;
    this._siteBodyElement = document.body;
    this._comments = null;
    this._api = api;

    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleCloseBtnClick = this._handleCloseBtnClick.bind(this);
    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
  }

  init() {
    this._popupStatus = PopupStatus.CLOSE;

    const prevFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent =  new FilmCardView(this._getMovie());

    this._filmCardComponent.setPopupOpenHandler(this._handleFilmCardClick);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);

    if (prevFilmCardComponent === null) {
      render(this._container, this._filmCardComponent);
      return;
    }

    if (this._popupStatus === PopupStatus.CLOSE) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  _handleModelEvent(... Args) {
    const [,, isNewComment] = Args;

    if (this._popupStatus === PopupStatus.OPEN) {
      this._updatePopup(isNewComment);
    }
  }

  _getMovie() {
    const movies = this._moviesModel.get().slice();
    const [movie] = movies.filter((movie) => this._id === movie.id);
    return movie;
  }

  _renderPopup(movie, comments) {
    this._popupStatus = PopupStatus.OPEN;
    this._comments = comments;

    const prevFilmPopup = this._filmPopup;

    this._filmPopup = new FilmDetailsView(movie, comments);

    this._filmPopup.setCloseBtnClickHandler(this._handleCloseBtnClick);
    this._filmPopup.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopup.setWatchedClickHandler(this._handleWatchedClick);
    this._filmPopup.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopup.setFormSubmitHandler(this._handleFormSubmit);
    this._filmPopup.setCommentDeleteHandler(this._handleDeleteCommentClick);
    this._moviesModel.addObserver(this._handleModelEvent);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    if (prevFilmPopup === null) {
      render(this._siteBodyElement, this._filmPopup);
      this._siteBodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this._escKeydownHandler);
      return;
    }

    if (this._popupStatus === PopupStatus.OPEN) {
      replace(this._filmPopup, prevFilmPopup);

      this._siteBodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this._escKeydownHandler);
    }

    remove(prevFilmPopup);
  }

  _setViewState(state, payload) {
    const resetFormState = () => {
      this._filmPopup.updateState({
        isDisabled: false,
        deletingId: null,
      });
    };

    switch (state) {
      case State.SAVING:
        this._filmPopup.updateState({
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this._filmPopup.updateState({
          isDisabled: true,
          deletingId: payload,
        });
        break;
      case State.ABORTING:
        this._filmPopup.shake(resetFormState);
        break;
    }
  }

  setAborting() {
    if (this._filmPopup) {
      this._filmPopup.shake(() => {
        this._filmPopup.updateState({
          isDisabled: false,
          deletingId: null,
        });
      });

      return;
    }
    if (this._filmCardComponent) {
      this._filmCardComponent.shake();
    }
  }

  _closePopup() {
    if (this._popupStatus !== PopupStatus.CLOSE) {
      this._filmPopup.removeHandlers();
      remove(this._filmPopup);
      this._filmPopup = null;
      this._popupStatus = PopupStatus.CLOSE;
      this._siteBodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this._escKeydownHandler);
    }
  }

  _escKeydownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _handleCloseBtnClick() {
    this._closePopup();
  }

  _handleFilmCardClick() {
    return this._api.getComments(this._id)
      .then((response) => {
        this._renderPopup(this._getMovie(), response);
      })
      .catch(() => {
        this.setAborting();
      });
  }

  _handleWatchlistClick() {
    if (this._popupStatus === PopupStatus.OPEN) {
      this._setViewState(State.SAVING);
    }

    const movie = this._getMovie();

    this._changeData(
      UserAction.UPDATE_MOVIE,
      Object.assign(
        {},
        movie,
        {
          userDetails: {
            watchlist: !movie.userDetails.watchlist,
            alreadyWatched: movie.userDetails.alreadyWatched,
            watchingDate: movie.userDetails.watchingDate,
            favorite: movie.userDetails.favorite,
          },
        },
      ),
    );
  }

  _handleWatchedClick() {
    if (this._popupStatus === PopupStatus.OPEN) {
      this._setViewState(State.SAVING);
    }

    const movie = this._getMovie();

    this._changeData(
      UserAction.UPDATE_MOVIE,
      Object.assign(
        {},
        movie,
        {
          userDetails: {
            watchlist: movie.userDetails.watchlist,
            alreadyWatched: !movie.userDetails.alreadyWatched,
            watchingDate: !movie.userDetails.alreadyWatched ? dayjs() : '',
            favorite: movie.userDetails.favorite,
          },
        },
      ),
    );
  }

  _handleFavoriteClick() {
    if (this._popupStatus === PopupStatus.OPEN) {
      this._setViewState(State.SAVING);
    }

    const movie = this._getMovie();

    this._changeData(
      UserAction.UPDATE_MOVIE,
      Object.assign(
        {},
        movie,
        {
          userDetails: {
            watchlist: movie.userDetails.watchlist,
            alreadyWatched: movie.userDetails.alreadyWatched,
            watchingDate: movie.userDetails.watchingDate,
            favorite: !movie.userDetails.favorite,
          },
        },
      ),
    );
  }

  _handleFormSubmit(comment) {
    this._setViewState(State.SAVING);
    this._api.addComment(comment)
      .then((response) => {
        const newComments = response.comments;

        const newMovie = Object.assign(
          {},
          this._getMovie(),
          {
            comments: newComments,
          },
        );

        this._changeData(UserAction.ADD_COMMENT, UpdateType.MINOR, newMovie);
      })
      .catch(() => {
        this._setViewState(State.ABORTING);
      });
  }

  _handleDeleteCommentClick(commentId) {
    this._setViewState(State.DELETING, commentId);
    this._api.deleteComment(commentId)
      .then(() => {
        const filteredComments = this._comments
          .filter((item) => item.id !== String(commentId))
          .map((comment) => comment.id);

        const newMovie = Object.assign(
          {},
          this._getMovie(),
          {
            comments: filteredComments,
          },
        );

        this._changeData(UserAction.UPDATE_MOVIE, UpdateType.MINOR, newMovie);
      })
      .catch(() => {
        this._setViewState(State.ABORTING);
      });
  }

  _updatePopup(isNewComment) {
    const scrollPosition = this._getScrollPosition();
    this._closePopup();
    this._api.getComments(this._id)
      .then((response) => {
        this._renderPopup(this._getMovie(), response);
        this._updateScrollPosition(scrollPosition, isNewComment);
      });
  }

  _getScrollPosition() {
    if (document.querySelector('.film-details')) {
      return document.querySelector('.film-details').scrollTop;
    }
  }

  _updateScrollPosition(scrollPosition, isNewcomment) {
    const popup = document.querySelector('.film-details');
    popup.scrollTo(0, scrollPosition);
    if (Object.values(isNewcomment)[0]) {
      popup.scrollTop = popup.scrollHeight;
    }
  }

  destroy() {
    remove(this._filmCardComponent);
  }
}
