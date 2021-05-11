import FiltersBlockView from '../view/main-navigation.js';
import { render, replace, remove, RenderPosition } from '../utils/render.js';
import { FilterType, UpdateType } from '../const.js';
import { filter } from '../utils/common.js';

export default class FilterPresenter {
  constructor(filterContainer, filtersModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filtersModel = filtersModel;
    this._filmsModel = filmsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FiltersBlockView(filters, this._filtersModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      // {
      //   type: FilterType.ALL,
      //   count: null,
      // },
      {
        type: FilterType.WATCHLIST,
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.WATCHED,
        count: filter[FilterType.WATCHED](films).length,
      },
      {
        type: FilterType.FAVORITES,
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  _handleFilterTypeChange(filterType) {
    if (this._filtersModel.getFilter() === filterType) {
      return;
    }

    this._filtersModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleModelEvent() {
    this.init();
  }
}
