import AbstractView from './abstract';

const createFooterStats = (filmsCount) => {
  return `<p>
    ${filmsCount} movies inside
  </p>`;
};

export default class FooterStats extends AbstractView {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFooterStats(this._filmsCount);
  }
}
