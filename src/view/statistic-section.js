import AbstractView from './abstract';

const createStatisticSection = () => {
  return '<section class="statistic visually-hidden"></section>';
};

export default class StatisticSection extends AbstractView {
  getTemplate() {
    return createStatisticSection();
  }
}
