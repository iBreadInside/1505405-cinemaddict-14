export const createFilmCard = () => {
  return `<article class="film-card">
    <h3 class="film-card__title"></h3>
    <p class="film-card__rating"></p>
    <p class="film-card__info">
      <span class="film-card__year"></span>
      <span class="film-card__duration"></span>
      <span class="film-card__genre"></span>
    </p>
    <img src="" alt="" class="film-card__poster">
    <p class="film-card__description"></p>
    <a class="film-card__comments"></a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export const createFilmsSection = () => {
  return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container"></div>
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container films-list__container--top-rated"></div>
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container films-list__container--most-commented"></div>
    </section>
  </section>`;
};
