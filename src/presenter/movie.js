import { remove, render, replace, RenderPosition } from '../utils/render';
import FilmCard from '../view/film-card';
import FilmDetails from '../view/film-details';
import { UpdateType } from '../const.js';

const popupStatus = {
  CLOSE: 'CLOSE',
  OPEN: 'OPEN',
};

export default class MoviePresenter {
  constructor(filmListContainer, commentsList, changeData, changePopupStatus) {
    this._filmListContainer = filmListContainer;
    this._comments = commentsList.slice();
    this._changeData = changeData;
    this._changeMode = changePopupStatus;
    this._filmCardComponent = null;
    this._popupStatus = popupStatus.CLOSE;

    this._siteBodyElement = document.body;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._renderFilmPopup = this._renderFilmPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  init(filmCard) {
    this._filmCard = filmCard;

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCard(filmCard);
    this._filmCardComponent.setControlWatchlistHandler(this._handleWatchlistClick);
    this._filmCardComponent.setControlWatchedHandler(this._handleWatchedClick);
    this._filmCardComponent.setControlFavoriteHandler(this._handleFavoriteClick);
    this._filmCardComponent.setPopupOpenHandler(this._renderFilmPopup);

    if (prevFilmCardComponent === null) {
      render(this._filmListContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmListContainer.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
  }

  _closePopup() {
    remove(this._filmPopup);
    this._siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._popupStatus = popupStatus.CLOSE;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _handleWatchlistClick() {
    this._changeData(
      UpdateType.MINOR,
      Object.assign(
        {},
        this._filmCard,
        {
          user_details: {
            watchlist: !this._filmCard.user_details.watchlist,
            already_watched: this._filmCard.user_details.already_watched,
            favorite: this._filmCard.user_details.favorite,
          },
        },
      ),
    );
  }

  _handleWatchedClick() {
    this._changeData(
      UpdateType.MINOR,
      Object.assign(
        {},
        this._filmCard,
        {
          user_details: {
            watchlist: this._filmCard.user_details.watchlist,
            already_watched: !this._filmCard.user_details.already_watched,
            favorite: this._filmCard.user_details.favorite,
          },
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UpdateType.MINOR,
      Object.assign(
        {},
        this._filmCard,
        {
          user_details: {
            watchlist: this._filmCard.user_details.watchlist,
            already_watched: this._filmCard.user_details.already_watched,
            favorite: !this._filmCard.user_details.favorite,
          },
        },
      ),
    );
  }

  _renderFilmPopup() {
    this._changeMode();

    this._filmPopup = new FilmDetails(this._filmCard, this._comments);
    document.addEventListener('keydown', this._escKeyDownHandler);

    this._popupStatus = popupStatus.OPEN;

    this._filmPopup.setCloseBtnClickHandler(this._closePopup);
    this._filmPopup.setPopupWatchlistHandler(this._handleWatchlistClick);
    this._filmPopup.setPopupWatchedHandler(this._handleWatchedClick);
    this._filmPopup.setPopupFavoriteHandler(this._handleFavoriteClick);

    render(
      this._siteBodyElement,
      this._filmPopup,
      RenderPosition.BEFOREEND,
    );
  }

  resetView() {
    if (this._popupStatus !== popupStatus.CLOSE) {
      this._closePopup();
    }
  }
}
