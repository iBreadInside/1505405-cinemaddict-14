import { remove, render, replace, RenderPosition } from '../utils/render';
import Comment from '../view/comment';
import FilmCard from '../view/film-card';
import FilmDetails from '../view/film-details';

const popupStatus = {
  CLOSE: 'CLOSE',
  OPEN: 'OPEN',
};

export default class MoviePresenter {
  constructor(filmListContainer, commentsList, changeData) {
    this._filmListContainer = filmListContainer;
    this._comments = commentsList.slice();
    this._changeData = changeData;

    this._filmCardComponent = null;
    this._popupStatus = popupStatus.CLOSE;

    this._siteBodyElement = document.body;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._closeBtnHandler = this._closeBtnHandler.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(filmCard, filmList) {
    this._filmCard = filmCard;
    this._filmList = filmList;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevPopupComponent = this._filmPopup;

    this._filmCardComponent = new FilmCard(filmCard);
    this._filmPopup = new FilmDetails(filmCard);
    this._comment = new Comment(this._comments[0]);

    if (prevFilmCardComponent === null || prevPopupComponent === null) {
      render(this._filmListContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      this._setFilmCardHandlers();

      return;
    }

    if (this._filmListContainer.contains(prevFilmCardComponent.getElement())) {
      // this._filmCardComponent.removeHandlers();
      this._setFilmCardHandlers();

      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (this._popupStatus === popupStatus.OPEN) {
      this._setPopupHandlers();
      replace(this._filmPopup, prevPopupComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevPopupComponent);
  }

  resetView() {
    if (this._popupStatus !== popupStatus.CLOSE) {
      this._closePopup();
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmPopup);
  }

  _setFilmCardHandlers() {
    this._filmCardComponent.setPopupOpenHandler(() => {
      this._renderFilmPopup();
    });

    this._filmCardComponent.setControlWatchlistHandler(this._handleWatchlistClick);
    this._filmCardComponent.setControlWatchedHandler(this._handleWatchedClick);
    this._filmCardComponent.setControlFavoriteHandler(this._handleFavoriteClick);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._popupStatus = popupStatus.CLOSE;
      remove(this._filmPopup);
      this._siteBodyElement.classList.toggle('hide-overflow');
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._filmCard,
        {
          user_details: {
            watchlist: !this._filmCard.user_details.watchlist,
          },
        },
      ),
    );
  }

  _handleWatchedClick() {
    this._changeData(
      Object.assign(
        {},
        this._filmCard,
        {
          user_details: {
            already_watched: !this._filmCard.user_details.already_watched,
          },
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._filmCard,
        {
          user_details: {
            favorite: !this._filmCard.user_details.favorite,
          },
        },
      ),
    );
  }

  _closeBtnHandler() {
    this._siteBodyElement.classList.toggle('hide-overflow');
    remove(this._filmPopup);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._popupStatus = popupStatus.CLOSE;
  }

  _setPopupHandlers() {
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._filmPopup.setCloseBtnClickHandler(this._closeBtnHandler);
    this._filmPopup.setPopupWatchlistHandler(this._handleWatchlistClick);
    this._filmPopup.setPopupWatchedHandler(this._handleWatchedClick);
    this._filmPopup.setPopupFavoriteHandler(this._handleFavoriteClick);
  }

  _renderFilmPopup() {
    this._siteBodyElement.appendChild(this._filmPopup.getElement());
    this._siteBodyElement.classList.toggle('hide-overflow');
    this._popupStatus = popupStatus.OPEN;
    this._setPopupHandlers();

    render(this._filmPopup.getElement().querySelector('.film-details__comments-list'), this._comment, RenderPosition.BEFOREEND);
  }
}