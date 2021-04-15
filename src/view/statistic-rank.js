import AbstractView from './abstract';

const createStatisticRank = () => {
  return `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>`;
};

export default class StatisticRank extends AbstractView {
  getTemplate() {
    return createStatisticRank();
  }
}
