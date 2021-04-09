// import dayjs from 'dayjs';
import { formatingRuntime } from '../utils';

export const createStatisticText = (counter) => {
  return `<ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${counter.watched} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${formatingRuntime(counter.total_runtime,'','').hours} <span class="statistic__item-description">h</span> ${formatingRuntime(counter.total_runtime,'','').minutes} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${counter.top_genre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>`;
};
