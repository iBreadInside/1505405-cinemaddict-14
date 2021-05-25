import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-detail.js';
import { render, remove, replace }  from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';
import dayjs from 'dayjs';

const PopupStatus = {
  CLOSE: 'CLOSE',
  OPEN: 'OPEN',
};

export default class MoviePresenter {
  constructor(container, changeData, id, commentsModel, moviesModel, filterModel, changePopupStatus) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changePopupStatus;
    this._id = id;
    this._commentsModel = commentsModel;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;

    this._filmCardComponent = null;
    this._filmPopup = null;
    this._popupStatus = PopupStatus.CLOSE;
    this._siteBodyElement = document.body;

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
    this._filmCardComponent =  new FilmCardView(this._getMovie(), this._getMovieComments());
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

  _getMovie() {
    const movies = this._moviesModel.get().slice();
    const [movie] = movies.filter((movie) => this._id === movie.id);
    return movie;
  }

  _getComments() {
    return this._commentsModel.get().slice();
  }

  _getMovieComments() {
    const commentsArray = this._getComments();
    const {comments} = this._getMovie();
    return commentsArray.filter(({id}) => comments.includes(id));
  }

  _renderPopup(movie, comments) {
    this._popupStatus = PopupStatus.OPEN;

    const prevFilmPopup = this._filmPopup;

    this._filmPopup = new FilmDetailsView(movie, comments);

    this._filmPopup.setCloseBtnClickHandler(this._handleCloseBtnClick);
    this._filmPopup.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopup.setWatchedClickHandler(this._handleWatchedClick);
    this._filmPopup.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopup.setFormSubmitHandler(this._handleFormSubmit);
    this._filmPopup.setCommentDeleteHandler(this._handleDeleteCommentClick);

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

  _closePopup() {
    if (this._popupStatus !== PopupStatus.CLOSE) {
      remove(this._filmPopup);
      this._filmPopup = null;
      this._popupStatus = PopupStatus.CLOSE;
    }

    this._siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeydownHandler);
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
    this._renderPopup(this._getMovie(), this._getMovieComments());
  }

  _updTypeByActiveFilter() {
    if (this._filterModel.get() === 'ALL') {
      return UpdateType.MINOR;
    } else {
      return UpdateType.MINOR;
    }
  }

  _handleWatchlistClick() {
    const movie = this._getMovie();

    this._changeData(
      UserAction.UPDATE_MOVIE,
      this._updTypeByActiveFilter(),
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
    const movie = this._getMovie();

    this._changeData(
      UserAction.UPDATE_MOVIE,
      this._updTypeByActiveFilter(),
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
    const movie = this._getMovie();

    this._changeData(
      UserAction.UPDATE_MOVIE,
      this._updTypeByActiveFilter(),
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
    const movieComments = this._getMovie().comments;

    const newComments = [...movieComments.slice(), comment.id];
    const newMovie = Object.assign(
      {},
      this._getMovie(),
      {
        comments: newComments,
      },
    );

    this._changeData(UserAction.UPDATE_MOVIE, UpdateType.MINOR, newMovie);
    this._changeData(UserAction.ADD_COMMENT, UpdateType.MINOR, comment);
    this._resetPopup();
  }

  _handleDeleteCommentClick(comment) {
    const movieComments = this._getMovie().comments;
    const filteredComments = movieComments.filter((item) => item !== comment.id);

    const newMovie = Object.assign(
      {},
      this._getMovie(),
      {
        comments: filteredComments,
      },
    );

    this._changeData(UserAction.UPDATE_MOVIE, UpdateType.MINOR, newMovie);
    this._changeData(UserAction.DELETE_COMMENT, UpdateType.MINOR, comment);
    this._resetPopup();
  }

  _resetPopup() {
    const scrollPosition = document.querySelector('.film-details').scrollTop;

    this._closePopup();
    this._renderPopup(this._getMovie(), this._getMovieComments());

    if (scrollPosition !== 0) {
      const newCommentScroll = document.querySelector('.film-details__new-comment').scrollHeight;
      document.querySelector('.film-details').scrollTo(0, scrollPosition + newCommentScroll);
    }
  }

  destroy() {
    remove(this._filmCardComponent);
  }
}
