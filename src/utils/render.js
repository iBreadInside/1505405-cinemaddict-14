import dayjs from 'dayjs';
import AbstractView from '../view/abstract';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const render = (container, child, place) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (child instanceof AbstractView) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    default:
      container.append(child);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export const compareRating = (firstCard, secondCard) => {
  const firstRating = firstCard.filmInfo.totalRating;
  const secondRating = secondCard.filmInfo.totalRating;

  return secondRating - firstRating;
};

export const compareCommentsNumber = (firstCard, secondCard) => {
  const firstComments = firstCard.comments.length;
  const secondComments = secondCard.comments.length;

  return secondComments - firstComments;
};

export const compareFilmDate = (firstCard, secondCard) => {
  return dayjs(secondCard.filmInfo.release.date).diff(dayjs(firstCard.filmInfo.release.date));
};
