import { FilterType } from '../const';
import AbstractView from './abstract';

const createFiltersBlock = (filters, activeFilter) => {
  const [watchlist, watched, favorite] = filters;
  const activeClass = 'main-navigation__item--active';

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item ${activeFilter === FilterType.ALL ? activeClass : ''}" data-type="ALL">All movies</a>
    <a href="#watchlist" class="main-navigation__item ${activeFilter === FilterType.WATCHLIST ? activeClass : ''}" data-type="WATCHLIST">Watchlist <span class="main-navigation__item-count">${watchlist.count}</span></a>
    <a href="#history" class="main-navigation__item ${activeFilter === FilterType.WATCHED ? activeClass : ''}" data-type="WATCHED">History <span class="main-navigation__item-count">${watched.count}</span></a>
    <a href="#favorites" class="main-navigation__item ${activeFilter === FilterType.FAVORITES ? activeClass : ''}" data-type="FAVORITES">Favorites <span class="main-navigation__item-count">${favorite.count}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;
};

export default class FiltersBlockView extends AbstractView {
  constructor(filters, activeFilter) {
    super();
    this._filters = filters;
    this._activeFilter = activeFilter;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersBlock(this._filters, this._activeFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterClick(evt.target.dataset.type);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterClick = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
