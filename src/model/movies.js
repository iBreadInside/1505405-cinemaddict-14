import Observer from '../utils/observer';

export default class MoviesModel extends Observer {
  constructor() {
    super();
    this._filmCards = [];
  }

  setFilms(filmCards) {
    this._filmCards = filmCards.slice();
  }

  getFilms() {
    return this._filmCards;
  }

  updateFilm(updateType, update) {
    const index = this._filmCards.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._filmCards = [
      ...this._filmCards.slice(0, index),
      update,
      ...this._filmCards.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
