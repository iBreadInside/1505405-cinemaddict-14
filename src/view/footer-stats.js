import { createElement } from '../utils';

const createFooterStats = (filmsCount) => {
  return `<p>
    ${filmsCount} movies inside
  </p>`;
};

export default class FooterStats {
  constructor(filmsCount) {
    this._filmsCount = filmsCount;
    this._element = null;
  }

  getTemplate() {
    return createFooterStats(this._filmsCount);
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
