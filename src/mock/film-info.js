import {
  ACTORS,
  AGE_RATINGS,
  ALTERNATIVE_TITLE,
  DATE,
  DESCRIPTION_SENTENCES,
  DIRECTOR,
  GENRES,
  POSTERS,
  RELEASE_COUNTRIES,
  RUNTIME,
  TITLES,
  WRITERS
} from '../const';

import {
  generateRandomBoolean,
  getRandomFromArray,
  getRandomNumber,
  isWatched,
  modificateArray
} from '../utils';

export const generateFilmCard = () => {
  return {
    id: 0,
    // comments: [
    //   $Comment.id$, $Comment.id$
    // ],
    film_info: {
      title: getRandomFromArray(TITLES),
      alternative_title: ALTERNATIVE_TITLE,
      total_rating: getRandomNumber(0, 10, 1),
      poster: `images/posters/${getRandomFromArray(POSTERS)}`,
      age_rating: getRandomFromArray(AGE_RATINGS),
      director: DIRECTOR,
      writers: modificateArray(WRITERS),
      actors: modificateArray(ACTORS),
      release: {
        date: DATE,
        release_country: getRandomFromArray(RELEASE_COUNTRIES),
      },
      runtime: RUNTIME,
      genre: modificateArray(GENRES),
      description: modificateArray(DESCRIPTION_SENTENCES, 4).join(' '),
    },
    user_details: {
      watchlist: generateRandomBoolean(),
      already_watched: isWatched(),
      watching_date: DATE,
      favorite: generateRandomBoolean(),
    },
  };
};
