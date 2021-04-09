import {
  ACTORS,
  AGE_RATINGS,
  ALTERNATIVE_TITLE,
  DATES,
  DESCRIPTION_SENTENCES,
  DIRECTOR,
  GENRES,
  ID_COMMENTS,
  POSTERS,
  RELEASE_COUNTRIES,
  RUNTIMES,
  TITLES,
  WRITERS
} from '../const';

import {
  generateRandomBoolean,
  getRandomFromArray,
  getRandomNumber,
  modificateArray
} from '../utils';

export const generateFilmCard = () => {
  return {
    id: 0,
    comments: modificateArray(ID_COMMENTS),
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
        date: getRandomFromArray(DATES),
        release_country: getRandomFromArray(RELEASE_COUNTRIES),
      },
      runtime: getRandomFromArray(RUNTIMES),
      genre: modificateArray(GENRES),
      description: modificateArray(DESCRIPTION_SENTENCES, 4).join(' '),
    },
    user_details: {
      watchlist: generateRandomBoolean(),
      already_watched: generateRandomBoolean(),
      watching_date: getRandomFromArray(DATES),
      favorite: generateRandomBoolean(),
    },
  };
};
