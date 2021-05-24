import Observer from '../utils/observer';

export default class MoviesModel extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  set(movie) {
    this._movies = movie.slice();
  }

  get() {
    return this._movies;
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
