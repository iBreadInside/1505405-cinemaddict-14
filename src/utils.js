export const getRandomNumber = (min = 0, max = 1, fractionDigits = 0) => {
  const fractionMultiplier = Math.pow(10, fractionDigits);
  min = Math.abs(min);
  max = Math.abs(max); // Условия для поиска среди положительных значений
  if (min > max) { [min, max] = [max, min]; }
  return Math.round(
    (Math.random() * (max - min) + min) * fractionMultiplier,
  ) / fractionMultiplier;
};

// Random sorting
export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getRandomFromArray = (arrayName) => {
  return arrayName[getRandomNumber(0, arrayName.length - 1)];
};

export const modificateArray = (arrayName, arrayLength = arrayName.length - 1) => {
  return shuffle(arrayName).slice(0, getRandomNumber(1, arrayLength));
};

// Set state of watchlist, watched and favorite
export const generateRandomBoolean = () => {
  return Boolean(getRandomNumber(0, 1));
};

export const isWatched = () => {
  const watchedState = generateRandomBoolean();
  if (watchedState) {
    // watching_date function
    return watchedState;
  } else {
    return watchedState;
  }
};

export const filmCardControlsClassName = (controlType) => {
  if (controlType) {
    return 'film-card__controls-item--active';
  } else {
    return '';
  }
};

export const filmDetailControlsChecked = (controlType) => {
  if (controlType) {
    return 'checked';
  } else {
    return '';
  }
};

export const generateCellSpans = (checkedValue, term) => {
  const spans = [];
  for (let i = 0; i < checkedValue.length; i++) {
    spans.push(`<span class="film-details__${term}">${checkedValue[i]}</span>`);
  }
  return spans.join('');
};

export const formatingRuntime = (element) => {
  if (element.runtime >= 60) {
    return `${Math.trunc(element.runtime / 60)}h ${element.runtime % 60}m`;
  } else {
    return `${element.runtime}m`;
  }
};

export const checkPlural = (noun, enumeration) => {
  return (enumeration.length > 1) ? `${noun}s` : noun;
};
