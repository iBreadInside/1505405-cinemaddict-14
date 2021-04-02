// const siteHeaderLogoElement = document.querySelector('.header__logo');
// const siteMainElement = document.querySelector('.main');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place,template);
};

render();
