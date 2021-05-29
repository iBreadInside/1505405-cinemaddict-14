import { MenuItem, UserRank } from '../const';

export const getRandomNumber = (min = 0, max = 1, fractionDigits = 0) => {
  const fractionMultiplier = Math.pow(10, fractionDigits);
  min = Math.abs(min);
  max = Math.abs(max); // Условия для поиска среди положительных значений
  if (min > max) { [min, max] = [max, min]; }
  return Math.round(
    (Math.random() * (max - min) + min) * fractionMultiplier,
  ) / fractionMultiplier;
};

// Random sorting
export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getRandomFromArray = (arrayName) => {
  return arrayName[getRandomNumber(0, arrayName.length - 1)];
};

export const modificateArray = (arrayName, arrayLength = arrayName.length - 1) => {
  return shuffle(arrayName).slice(0, getRandomNumber(1, arrayLength));
};

// Set state of watchlist, watched and favorite
export const generateRandomBoolean = () => {
  return Boolean(getRandomNumber(0, 1));
};

export const editAttribute = (addition, controlType) => {
  if (controlType) {
    return addition;
  } else {
    return '';
  }
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

export const checkPlural = (noun, enumeration) => {
  return (enumeration.length > 1) ? `${noun}s` : noun;
};

export const filter = {
  [MenuItem.ALL_MOVIES]: (movies) => movies,
  [MenuItem.WATCHLIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [MenuItem.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [MenuItem.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
  [MenuItem.STATS]: (movies) => movies,
};

export const rank = {
  [UserRank.NOVICE]: (count) => count <= 10,
  [UserRank.FAN]: (count) => count <= 20 && count > 10,
  [UserRank.MOVIE_BUFF]: (count) => count > 20,
};

export const getRankName = (movies) => {
  const alreadyWatchedMovies = movies.filter((movie) => movie.userDetails.alreadyWatched);
  const watchedMoviesAmount = alreadyWatchedMovies.length;
  const [rankName] = Object.entries(rank)
    .filter(([, rankCount]) => rankCount(watchedMoviesAmount))
    .flat();

  return rankName;
};
