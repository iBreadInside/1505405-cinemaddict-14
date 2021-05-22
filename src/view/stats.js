import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import SmartView from './smart.js';
// import {filterWatchedMoviesInRange, countMoviesByGenre, makeItemsUniq} from '../utils/statistics.js';
import { getRankName } from '../utils/common.js';
import { TimeRange } from '../const.js';

const BAR_HEIGHT = 50;

const filterWatchedMoviesInRange = ({movies, range}) => {
  if (range === TimeRange.ALL_TIME) {
    return movies;
  }

  return movies.filter((movie) => {
    const currentDate = dayjs();
    return dayjs(movie.user_details.watching_date).isSame(currentDate, range);
  });
};

const makeItemsUniq = (items) => [...new Set(items)];

const countMoviesByGenre = (movies, currentGenre) => {
  return movies.filter((movie) => movie.film_info.genre.includes(currentGenre)).length;
};

const createCountMoviesByGenre = (movies) => {
  const watchedMovies = movies.filter((movie) => movie.user_details.already_watched);
  const moviesGenresArray = watchedMovies
    .map((movie) => movie.film_info.genre)
    .flat(1);
  const uniqGenres = makeItemsUniq(moviesGenresArray);
  const movieByGenreCounts = uniqGenres.map((currentGenre) => {
    return {
      currentGenre,
      count: countMoviesByGenre(watchedMovies, currentGenre),
    };
  });
  const sortedMovieByGenreCounts = movieByGenreCounts.sort((a, b) => b.count - a.count);
  return sortedMovieByGenreCounts;
};

const getTopGenre = (movies) => {
  if (!movies.length) {
    return '';
  }

  return createCountMoviesByGenre(movies)[0].currentGenre;
};

const renderChart = (statisticCtx, movies) => {
  const sortedMovieByGenreCounts = createCountMoviesByGenre(movies);
  const genres = sortedMovieByGenreCounts.map((obj) => obj.currentGenre);
  const counts = sortedMovieByGenreCounts.map((obj) => obj.count);
  statisticCtx.style.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genres,
      datasets: [{
        data: counts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const getTotalWatchedTime = (movies) => {
  if (!movies) {
    return '0';
  }

  return movies.reduce((counter, movie) => {
    return counter + movie.film_info.runtime;
  }, 0);
};

const parseWatchedTime = (timeInMin) => {
  if (!timeInMin) {
    return {
      h: 0,
      m: 0,
    };
  }

  if (timeInMin < 60) {
    return {
      h: 0,
      m: timeInMin,
    };
  }

  const h = parseInt(timeInMin / 60);

  return {
    h,
    m: timeInMin - (h * 60),
  };
};

const renderStatistic = (movies) => {
  const watchedMovies = movies.filter((movie) => movie.user_details.already_watched);
  const watchedMoviesCount = watchedMovies.length;
  const totalWatchedTimeInMin = getTotalWatchedTime(watchedMovies);
  const h = parseWatchedTime(totalWatchedTimeInMin).h;
  const m = parseWatchedTime(totalWatchedTimeInMin).m;
  const topGenre = getTopGenre(movies);

  return `<ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${watchedMoviesCount ? watchedMoviesCount : '0'} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${h} <span class="statistic__item-description">h</span> ${m} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>`;
};

const createStatsTemplate = ({movies, range}, filteredMovies) => {
  const rankName = getRankName(movies);
  const statistic = renderStatistic(filteredMovies);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rankName ? rankName : 'Oooops, no rank'}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="${TimeRange.ALL_TIME}"${range === TimeRange.ALL_TIME ? ' checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="${TimeRange.DAY}"${range === TimeRange.DAY ? ' checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="${TimeRange.WEEK}"${range === TimeRange.WEEK ? ' checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="${TimeRange.MONTH}"${range === TimeRange.MONTH ? ' checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="${TimeRange.YEAR}"${range === TimeRange.YEAR ? ' checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    ${statistic}

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class StatsView extends SmartView {
  constructor(movies) {
    super();
    this._movies = movies.slice();
    this._range = TimeRange.ALL_TIME;
    this._chart = null;
    this._state = {
      movies: this._movies,
      range: TimeRange.ALL_TIME,
    };

    this._statsClickHandler = this._statsClickHandler.bind(this);

    this._setCharts();
    this._setStatsChangeHandler();
  }

  getTemplate() {
    return createStatsTemplate(this._state, this._getWatchedMovies());
  }

  _getWatchedMovies() {
    return filterWatchedMoviesInRange(this._state);
  }

  restoreHandlers() {
    this._setCharts();
    this._setStatsChangeHandler();
  }

  removeElement() {
    super.removeElement();

    if(this._chart !== null) {
      this._chart = null;
    }
  }

  _statsClickHandler(evt) {
    evt.preventDefault();

    const range = evt.target.value;
    this.updateState({
      range: range,
    });
  }

  _setStatsChangeHandler() {
    this.getElement()
      .querySelector('.statistic__filters')
      .addEventListener('change', this._statsClickHandler);
  }

  _setCharts() {
    if(this._chart !== null) {
      this._chart = null;
    }

    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._chart = renderChart(statisticCtx, this._getWatchedMovies());
  }
}
