import dayjs from 'dayjs';
import { CARD_DESCRIPTION_LENGTH } from '../const';
import { editAttribute, formatingRuntime } from '../utils';

export const createFilmCard = (filmCard) => {
  const {film_info, user_details} = filmCard;

  const descriptionReduction = () => {
    if (film_info.description.length > CARD_DESCRIPTION_LENGTH) {
      return `${film_info.description.slice(0, CARD_DESCRIPTION_LENGTH)}...`;
    } else {
      return film_info.description;
    }
  };

  return `<article class="film-card">
    <h3 class="film-card__title">${film_info.title}</h3>
    <p class="film-card__rating">${film_info.total_rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${dayjs(film_info.release.date).year()}</span>
      <span class="film-card__duration">${formatingRuntime(film_info)}</span>
      <span class="film-card__genre">${film_info.genre[0]}</span>
    </p>
    <img src="${film_info.poster}" alt="${film_info.title} poster" class="film-card__poster">
    <p class="film-card__description">${descriptionReduction()}</p>
    <a class="film-card__comments">5 comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${editAttribute('film-card__controls-item--active', user_details.watchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${editAttribute('film-card__controls-item--active', user_details.already_watched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${editAttribute('film-card__controls-item--active', user_details.favorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};
