export const createFilmCard = (filmCard) => {
  const {film_info, user_details} = filmCard;
  const filmCardControlsClassName = (controlType) => {
    if (controlType) {
      return 'film-card__controls-item--active';
    } else {
      return '';
    }
  };

  return `<article class="film-card">
    <h3 class="film-card__title">${film_info.title}</h3>
    <p class="film-card__rating">${film_info.total_rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">1929</span>
      <span class="film-card__duration">1h 55m</span>
      <span class="film-card__genre">${film_info.genre[0]}</span>
    </p>
    <img src="${film_info.poster}" alt="${film_info.title} poster" class="film-card__poster">
    <p class="film-card__description">${film_info.description}</p>
    <a class="film-card__comments">5 comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${filmCardControlsClassName(user_details.watchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${filmCardControlsClassName(user_details.already_watched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${filmCardControlsClassName(user_details.favorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};
