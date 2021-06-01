import { MenuItem, UserRank } from '../const';

const RankLimit = {
  NOVICE_TO_FAN: 10,
  FAN_TO_MOVIE_BUFF: 20,
};

export const filter = {
  [MenuItem.ALL_MOVIES]: (movies) => movies,
  [MenuItem.WATCHLIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [MenuItem.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [MenuItem.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
  [MenuItem.STATS]: (movies) => movies,
};

export const rank = {
  [UserRank.NOVICE]: (count) => count <= RankLimit.NOVICE_TO_FAN,
  [UserRank.FAN]: (count) => count <= RankLimit.FAN_TO_MOVIE_BUFF && count > RankLimit.NOVICE_TO_FAN,
  [UserRank.MOVIE_BUFF]: (count) => count > RankLimit.FAN_TO_MOVIE_BUFF,
};

export const formatingRuntime = (element) => {
  const runtime = {
    hours: '',
    minutes: '',
  };

  if (element >= 60) {
    runtime.hours = `${Math.trunc(element / 60)}`;
    runtime.minutes = `${element % 60}`;
  } else {
    runtime.minutes = `${element}`;
  }
  return runtime;
};

export const generateFilmRuntime = (element) => {
  return [formatingRuntime(element).hours + 'h', formatingRuntime(element).minutes + 'm'].join(' ');
};

export const checkPlural = (noun, enumeration) => {
  return (enumeration.length > 1) ? `${noun}s` : noun;
};

export const getRankName = (movies) => {
  const alreadyWatchedMovies = movies.filter((movie) => movie.userDetails.alreadyWatched);
  const watchedMoviesAmount = alreadyWatchedMovies.length;
  const [rankName] = Object.entries(rank)
    .filter(([, rankCount]) => rankCount(watchedMoviesAmount))
    .flat();

  return rankName;
};
