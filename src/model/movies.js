import Observer from '../utils/observer';

export default class MoviesModel extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  set(updateType, movie) {
    this._movies = movie.slice();

    this._notify(updateType);
  }

  get() {
    return this._movies;
  }

  update(updateType, update, isNewcomment) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType, update, isNewcomment);
  }

  static adaptToClient(movie) {
    const adaptedMoviePart = Object.assign(
      {},
      movie,
      {
        filmInfo: movie.film_info,
        userDetails: movie.user_details,
      },
    );

    const newUserDetails = Object.assign(
      {},
      adaptedMoviePart.userDetails,
      {
        alreadyWatched: movie.user_details.already_watched,
        // favorite: movie.user_details.favorite,
        // watchlist: movie.user_details.watchlist,
        watchingDate: movie.user_details.watching_date ? new Date(movie.user_details.watching_date) : null,
      },
    );

    const newRelease = Object.assign(
      {},
      adaptedMoviePart.filmInfo.release,
      {
        releaseCountry: movie.film_info.release.release_country,
        date: new Date(movie.film_info.release.date),
      },
    );

    const newFilmInfo = Object.assign(
      {},
      adaptedMoviePart.filmInfo,
      {
        ageRating: movie.film_info.age_rating,
        alternativeTitle: movie.film_info.alternative_title,
        genre: movie.film_info.genre,
        totalRating: movie.film_info.total_rating,
        release: newRelease,
      },
    );

    const adaptedMovie = Object.assign(
      {},
      adaptedMoviePart,
      {
        userDetails: newUserDetails,
        filmInfo: newFilmInfo,
      },
    );

    delete adaptedMovie.film_info;
    delete adaptedMovie.user_details;
    delete adaptedMovie.userDetails.already_watched;
    // delete adaptedMovie.userDetails.favorite;
    delete adaptedMovie.userDetails.watching_date;
    // delete adaptedMovie.userDetails.watchlist;
    delete adaptedMovie.filmInfo.age_rating;
    delete adaptedMovie.filmInfo.alternative_title;
    delete adaptedMovie.filmInfo.genre;
    delete adaptedMovie.filmInfo.total_rating;
    delete adaptedMovie.filmInfo.release.release_country;

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedMoviePart = Object.assign(
      {},
      movie,
      {
        film_info: movie.filmInfo,
        user_details: movie.userDetails,
      },
    );

    const newUserDetails = Object.assign(
      {},
      adaptedMoviePart.user_details,
      {
        already_watched: movie.userDetails.alreadyWatched,
        // favorite: movie.userDetails.favorite,
        // watchlist: movie.userDetails.watchlist,
        watching_date: movie.userDetails.watchingDate ? movie.userDetails.watchingDate.toISOString() : null,
      },
    );

    const newRelease = Object.assign(
      {},
      adaptedMoviePart.film_info.release,
      {
        release_country: movie.filmInfo.release.releaseCountry,
        date: movie.filmInfo.release.date ? movie.filmInfo.release.date.toISOString() : null,
      },
    );

    const newFilmInfo = Object.assign(
      {},
      adaptedMoviePart.film_info,
      {
        age_rating: movie.filmInfo.ageRating,
        alternative_title: movie.filmInfo.alternativeTitle,
        // genre: movie.filmInfo.genre,
        total_rating: movie.filmInfo.totalRating,
        release: newRelease,
      },
    );

    const adaptedMovie = Object.assign(
      {},
      adaptedMoviePart,
      {
        user_details: newUserDetails,
        film_info: newFilmInfo,
      },
    );

    delete adaptedMovie.filmInfo;
    delete adaptedMovie.userDetails;
    delete adaptedMovie.user_details.alreadyWatched;
    // delete adaptedMovie.user_details.isFavorite;
    delete adaptedMovie.user_details.watchingDate;
    // delete adaptedMovie.user_details.isWatchlist;
    delete adaptedMovie.film_info.ageRating;
    delete adaptedMovie.film_info.alternativeTitle;
    // delete adaptedMovie.film_info.genres;
    delete adaptedMovie.film_info.totalRating;
    delete adaptedMovie.film_info.release.releaseCountry;

    return adaptedMovie;
  }
}
