import { DATES } from '../const';
import { nanoid } from 'nanoid';
import { generateRandomBoolean, getRandomFromArray, getRandomNumber, modificateArray } from '../utils/common';

const ACTORS = [
  'Morgan Freeman',
  'Danila Kozlovsky',
  'Daniel Redcliff',
  'John Travolta',
];

const AGE_RATINGS = [
  '0+',
  '6+',
  '16+',
  '18+',
];

const ALTERNATIVE_TITLE = 'Laziness Who Sold Themselves';

export const DIRECTOR = 'Christofer Nolan';

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'the-dance-of-life.jpg',
];

const GENRES = [
  'Comedy',
  'Horror',
  'Action',
  'Drama',
  'Documental',
];

const ID_COMMENTS = [0, 1, 2, 3, 4];

const TITLES = [
  'Made For Each Other',
  'Popeye Meets Sinbad',
  'Sagebrush Trail',
  'The Dance Of Life',
];

const DESCRIPTION_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const RELEASE_COUNTRIES = [
  'Finland',
  'Russian Federation',
  'USA',
  'Canada',
  'India',
];

const RUNTIMES = [
  36,
  22,
  77,
  54,
  60,
  82,
];

const WRITERS = [
  'Takeshi Kitano',
  'J.J. Abrams',
  'Mister X',
  'Stephen King',
];

export const generateFilmCard = () => {
  return {
    id: nanoid(),
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
