import FooterStatsView from '../view/footer-stats.js';
import { remove, render, replace }  from '../utils/render.js';

export default class FooterStatsPresenter {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._totalMoviesCount = null;

    this._footerStatsComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderFooterStats();
  }

  _getMovies() {
    return this._moviesModel.get().slice();
  }

  _renderFooterStats() {
    this._totalMoviesCount = this._moviesModel.get().length;

    if (!this._totalMoviesCount) {
      this._totalMoviesCount = 0;
    }

    const prevFooterStatsComponent = this._footerStatsComponent;
    this._footerStatsComponent = new FooterStatsView(this._totalMoviesCount);

    if (prevFooterStatsComponent === null) {
      return render(this._container, this._footerStatsComponent);
    }

    replace(this._footerStatsComponent, prevFooterStatsComponent);
    remove(prevFooterStatsComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
