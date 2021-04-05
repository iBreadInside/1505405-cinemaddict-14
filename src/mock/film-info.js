const TITLES = [
  'Made For Each Other',
  'Popeye Meets Sinbad',
  'Sagebrush Trail',
  'The Dance Of Life',
];

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'the-dance-of-life.jpg',
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

const GENRES = [
  'Comedy',
  'Horror',
  'Action',
  'Drama',
  'Documental',
];

const WRITERS = [
  'Takeshi Kitano',
  'J.J. Abrams',
  'Mister X',
  'Stephen King',
];

const ACTORS = [
  'Morgan Freeman',
  'Danila Kozlovsky',
  'Daniel Redcliff',
  'John Travolta',
];

const AGE_RATINGS = [
  0,
  6,
  16,
  18,
];

const RELEASE_COUNTRIES = [
  'Finland',
  'Russian Federation',
  'USA',
  'Canada',
  'India',
];

const DIRECTOR = 'Christofer Nolan';
const DATE = '2019-05-11T00:00:00.000Z';
const RUNTIME = 77;
const ALTERNATIVE_TITLE = 'Laziness Who Sold Themselves';

const getRandomNumber = (min = 0, max = 1, fractionDigits = 0) => {
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

const getRandomFromArray = (arrayName) => {
  return arrayName[getRandomNumber(0, arrayName.length - 1)];
};

const modificateArray = (arrayName, arrayLength = arrayName.length - 1) => {
  return shuffle(arrayName).slice(0, getRandomNumber(1, arrayLength));
};

// Set state of watchlist, watched and favorite
const generateRandomBoolean = () => {
  return Boolean(getRandomNumber(0, 1));
};

const isWatched = () => {
  const watchedState = generateRandomBoolean();
  if (watchedState) {
    // watching_date function
    return watchedState;
  } else {
    return watchedState;
  }
};

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
