// Render
export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

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

export const editAttribute = (addition, controlType) => {
  if (controlType) {
    return addition;
  } else {
    return '';
  }
};

export const formatingRuntime = (element, unitOne, unitTwo) => {
  const runtime = {
    hours: '',
    minutes: '',
  };

  if (element >= 60) {
    runtime.hours = `${Math.trunc(element / 60)}${unitOne} `;
    runtime.minutes = `${element % 60}${unitTwo}`;
  } else {
    runtime.minutes = `${element}${unitTwo}`;
  }
  return runtime;
};

export const checkPlural = (noun, enumeration) => {
  return (enumeration.length > 1) ? `${noun}s` : noun;
};

export const toggleClass = (element, className) => {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
};
