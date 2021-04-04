const TITLES = [
  'Made For Each Other',
  'Popeye Meets Sinbad',
  'Sagebrush Trail',
  'The Dance Of Life',
];

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomTitle = () => {
  return TITLES[getRandomInteger(0, TITLES.length - 1)];
};

export const generateFilmCard = () => {
  return {
    'id': '0',
    // 'comments': [
    //   $Comment.id$, $Comment.id$
    // ],
    'film_info': {
      'title': getRandomTitle(),
      'alternative_title': 'Laziness Who Sold Themselves',
      'total_rating': 5.3,
      'poster': 'images/posters/blue-blazes.jpg',
      'age_rating': 0,
      'director': 'Tom Ford',
      'writers': [
        'Takeshi Kitano',
      ],
      'actors': [
        'Morgan Freeman',
      ],
      'release': {
        'date': '2019-05-11T00:00:00.000Z',
        'release_country': 'Finland',
      },
      'runtime': 77,
      'genre': [
        'Comedy',
      ],
      'description': 'Oscar-winning film, a war drama about two young people, from the creators of timeless classic \'Nu, Pogodi!\' and \'Alice in Wonderland\', with the best fight scenes since Bruce Lee.',
    },
    'user_details': {
      'watchlist': false,
      'already_watched': true,
      'watching_date': '2019-04-12T16:12:32.554Z',
      'favorite': false,
    },
  };
};
