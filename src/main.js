import ProfileInfo from './view/profile.js';
import StatisticRank from './view/statistic-rank.js';
import StatisticFilter from './view/statistic-filter.js';
import StatisticText from './view/statistic-text.js';
import FooterStats from './view/footer-stats.js';
import { generateFilmCard } from './mock/film-info.js';
import { generateComments } from './mock/comments.js';
import StatisticSection from './view/statistic-section.js';
import { render, RenderPosition } from './utils/render.js';
import MovieListPresenter from './presenter/movie-list.js';

const FILMS_NUMBER = 17;
const COMMENTS_NUMBER = 5;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const filmCards = new Array(FILMS_NUMBER).fill().map(generateFilmCard);
const comments = new Array(COMMENTS_NUMBER).fill().map(generateComments);
comments.forEach((comment) => comment.id = comments.indexOf(comment));

// Render profile info
render(headerElement, new ProfileInfo(), RenderPosition.BEFOREEND);

// Render statistic
const statisticSection = new StatisticSection();
render(mainElement, statisticSection, RenderPosition.BEFOREEND);
render(statisticSection, new StatisticRank(), RenderPosition.BEFOREEND);
render(statisticSection, new StatisticFilter(), RenderPosition.BEFOREEND);

// Statistic counter
const countStatistic = () => {
  const counter = {
    watched: 0,
    total_runtime: 0,
    genre: {},
    top_genre: '',
  };
  for (const card of filmCards) {
    if (card.user_details.already_watched) {
      counter.watched++;
      counter.total_runtime += card.film_info.runtime;
      for (const genreName of card.film_info.genre) {
        if (genreName in counter.genre) {
          counter.genre[genreName]++;
        } else {
          counter.genre[genreName] = 1;
        }
      }
    }
  }

  let maxValue = 0;
  let maxKey = 0;
  for (const genreName of Object.keys(counter.genre)) {
    if (counter.genre[genreName] > maxValue) {
      maxValue = counter.genre[genreName];
      maxKey = genreName;
    }
    counter.top_genre = maxKey;
  }
  return counter;
};

render(statisticSection, new StatisticText(countStatistic()), RenderPosition.BEFOREEND);

const movieListPresenter = new MovieListPresenter(mainElement);
movieListPresenter.init(filmCards, comments);

render(footerStatisticsElement, new FooterStats(FILMS_NUMBER), RenderPosition.BEFOREEND);
