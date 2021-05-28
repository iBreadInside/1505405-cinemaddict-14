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
    this._api = api;

    this._filmCardComponent = null;
    this._filmPopup = null;
    this._popupStatus = PopupStatus.CLOSE;
    this._siteBodyElement = document.body;
    this._comments = null;
    this._newComment = null;

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
    const prevFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent =  new FilmCardView(this._getMovie());

    this._filmCardComponent.setPopupOpenHandler(this._handleFilmCardClick);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmCardComponent === null) {
      render(this._container, this._filmCardComponent);

      return;
    }

    if (this._popupStatus === PopupStatus.CLOSE) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
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
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);

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

  _updateUserDetailsData(data, actionType = UpdateType.MINOR) {
    const movie = this._getMovie();

    const newUserDetails = Object.assign(
      {},
      movie.userDetails,
      data,
    );

    const newMovie = Object.assign(
      {},
      movie,
      {
        userDetails: newUserDetails,
      },
    );

    this._changeData(UserAction.UPDATE_MOVIE, actionType, newMovie);
  }

  _getScrollPosition() {
    if (this._filmPopup.getElement()) {
      return this._filmPopup.getElement().scrollTop;
    }
  }

  _updateNewCommentInfo(comment, emotion) {
    this._newComment = {
      comment,
      emotion,
    };
  }

  _updateScrollPosition(scrollPosition, isNewcomment) {
    const popup = this._filmPopup.getElement();

    popup.scrollTo(0, scrollPosition);

    if (Object.values(isNewcomment)[0]) {
      popup.scrollTop = popup.scrollHeight;
    }
  }

  _updatePopup(isNewComment, movieId) {
    this._api.getComments(movieId)
      .then((response) => {
        const scrollPosition = this._getScrollPosition();
        this._closePopup();
        this._renderPopup(this._getMovie(), response);
        this._updateScrollPosition(scrollPosition, isNewComment);
        if (this._newComment) {
          this._filmPopup.updateNewCommentInput(this._newComment);
          this._newComment = null;
        }
      })
      .catch(() => {
        this._setViewState(State.ABORTING);
      });
  }

  _closePopup() {
    if (this._popupStatus !== PopupStatus.CLOSE) {
      this._filmPopup.removeHandlers();
      remove(this._filmPopup);
      this._filmPopup = null;
      this._popupStatus = PopupStatus.CLOSE;
      this._siteBodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this._escKeydownHandler);
      this._moviesModel.removeObserver(this._handleModelEvent);
    }
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

  // === Handlers ===

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

  _handleWatchlistClick(comment, emotion) {
    if (this._popupStatus === PopupStatus.OPEN) {
      this._updateNewCommentInfo(comment, emotion);
      this._setViewState(State.SAVING);
    }

    this._updateUserDetailsData({
      watchlist: !this._getMovie().userDetails.watchlist,
    });
  }

  _handleWatchedClick(comment, emotion) {
    if (this._popupStatus === PopupStatus.OPEN) {
      this._updateNewCommentInfo(comment, emotion);
      this._setViewState(State.SAVING);
    }

    this._updateUserDetailsData({
      alreadyWatched: !this._getMovie().userDetails.alreadyWatched,
      watchingDate: !this._getMovie().userDetails.alreadyWatched ? dayjs() : '',
    });
  }

  _handleFavoriteClick(comment, emotion) {
    if (this._popupStatus === PopupStatus.OPEN) {
      this._updateNewCommentInfo(comment, emotion);
      this._setViewState(State.SAVING);
    }

    this._updateUserDetailsData({
      favorite: !this._getMovie().userDetails.favorite,
    });
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

  _handleDeleteCommentClick(comment, emotion, commentId) {
    this._updateNewCommentInfo(comment, emotion);
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

  destroy() {
    remove(this._filmCardComponent);
  }

  _handleModelEvent(... args) {
    const [, movie, isNewComment] = args;
    const movieId = movie.id;

    if (this._popupStatus === PopupStatus.OPEN) {
      this._updatePopup(isNewComment, movieId);
    }
  }
}
