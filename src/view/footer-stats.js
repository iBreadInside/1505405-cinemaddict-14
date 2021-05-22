import AbstractView from './abstract';

const createFooterStats = (filmsCount) => {
  return `<section class="footer__statistics">
  <p>${filmsCount} movies inside</p>
</section>`;
};

export default class FooterStatsView extends AbstractView {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFooterStats(this._filmsCount);
  }
}
