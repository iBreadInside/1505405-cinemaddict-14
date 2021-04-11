import { createElement } from '../utils';

const createStatisticSection = () => {
  return '<section class="statistic visually-hidden"></section>';
};

export default class StatisticSection {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createStatisticSection();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
