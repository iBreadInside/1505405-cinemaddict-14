import FilterView from '../view/filter.js';
import SiteMenuView from '../view/site-menu.js';
import { render, replace, remove, RenderPosition } from '../utils/render.js';
import { filter } from '../utils/common.js';
import { MenuItem, UpdateType } from '../const.js';

export default class SiteMenuPresenter {
  constructor(container, filterModel, moviesModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;
    this._filterComponent = null;
    this._siteMenuComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleMenuItemClick = this._handleMenuItemClick.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderSiteMenu();
    this._renderFilters();
  }

  getMainNavContainer() {
    return this._siteMenuComponent.getElement();
  }

  _getFilters() {
    const movies = this._moviesModel.get();

    return [
      {
        type: MenuItem.ALL_MOVIES,
        name: 'All movies',
        count: filter[MenuItem.ALL_MOVIES](movies).length,
      },
      {
        type: MenuItem.WATCHLIST,
        name: 'Watchlist',
        count: filter[MenuItem.WATCHLIST](movies).length,
      },
      {
        type: MenuItem.HISTORY,
        name: 'History',
        count: filter[MenuItem.HISTORY](movies).length,
      },
      {
        type: MenuItem.FAVORITES,
        name: 'Favorites',
        count: filter[MenuItem.FAVORITES](movies).length,
      },
    ];
  }

  toggleMenuItem(menuItem) {
    switch (menuItem) {
      case MenuItem.STATS:
        this._siteMenuComponent
          .getElement()
          .querySelector('.main-navigation__additional')
          .classList.add('main-navigation__additional--active');
        break;
      default:
        this._siteMenuComponent
          .getElement()
          .querySelector('.main-navigation__additional')
          .classList.remove('main-navigation__additional--active');
        break;
    }
  }

  _renderFilters() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;
    this._filterComponent = new FilterView(filters, this._filterModel.get());
    this._filterComponent.setMenuItemClickHandler(this._handleMenuItemClick);

    if (prevFilterComponent === null) {
      render(this._siteMenuComponent, this._filterComponent, RenderPosition.AFTERBEGIN);

      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _renderSiteMenu() {
    const prevSiteMenuComponent = this._siteMenuComponent;
    this._siteMenuComponent = new SiteMenuView(this._filterModel.get());

    if (prevSiteMenuComponent === null) {
      render(this._container, this._siteMenuComponent);

      return;
    }

    replace(this._siteMenuComponent, prevSiteMenuComponent);
    remove(prevSiteMenuComponent);
  }

  _handleModelEvent() {
    this._renderFilters();
  }

  _handleMenuItemClick(menuItem) {
    if (this._filterModel.get() === menuItem) {
      return;
    }

    this._filterModel.set(UpdateType.MAJOR, menuItem);
  }
}
