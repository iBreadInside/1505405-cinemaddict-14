import FooterStatsView from '../view/footer-stats.js';
import { remove, render, replace }  from '../utils/render.js';

export default class FooterStatsPresenter {
  constructor(container, moviesModel, generalCount) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._generalCount = generalCount;

    this._footerStatsComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderFooterStats();
  }

  _handleModelEvent() {
    this.init();
  }

  _getMovies() {
    return this._moviesModel.get().slice();
  }

  _renderFooterStats() {
    if (this._getMovies().length === 0) {
      this._generalCount = 0;
    }

    const prevFooterStatsComponent = this._footerStatsComponent;
    this._footerStatsComponent = new FooterStatsView(this._generalCount);

    if (prevFooterStatsComponent === null) {
      return render(this._container, this._footerStatsComponent);
    }

    replace(this._footerStatsComponent, prevFooterStatsComponent);
    remove(prevFooterStatsComponent);
  }

  destroy() {
    remove(this._footerStatsComponent);
  }
}
