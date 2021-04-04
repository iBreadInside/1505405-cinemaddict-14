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

const DATE = '2019-05-11T00:00:00.000Z';
const RUNTIME = 77;

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

// Get description
const getRandomDescription = () => {
  return shuffle(DESCRIPTION_SENTENCES).slice(0, getRandomNumber(1, 4)).join(' ');
};

// Get genres
const getRandomGenres = () => {
  return shuffle(GENRES).slice(0, GENRES.length - 1);
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
      alternative_title: 'Laziness Who Sold Themselves',
      total_rating: getRandomNumber(0, 10, 1),
      poster: `images/posters/${getRandomFromArray(POSTERS)}`,
      age_rating: 0,
      director: 'Tom Ford',
      writers: [
        'Takeshi Kitano',
      ],
      actors: [
        'Morgan Freeman',
      ],
      release: {
        date: DATE,
        release_country: 'Finland',
      },
      runtime: RUNTIME,
      genre: getRandomGenres(),
      description: getRandomDescription(),
    },
    user_details: {
      watchlist: generateRandomBoolean(),
      already_watched: isWatched(),
      watching_date: DATE,
      favorite: generateRandomBoolean(),
    },
  };
};
