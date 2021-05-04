import AbstractView from './abstract.js';

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._filmState = {};
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this._scroll = this.getElement().scrollTop; // Запоминает позицию скролла
    this.removeElement(); // Удаляет старый DOM

    const newElement = this.getElement(); // Создает новый DOM
    parent.replaceChild(newElement, prevElement); // Замена старого новым
    this.getElement().scrollTop = this._scroll; // Возвращает позиию скролла
    this.restoreHandlers(); // Добавляет обработчики
  }

  updateState(update, justStateUpdating = false, scrollTopPosition = null) {
    if (!update) {
      return;
    }

    this._filmState = Object.assign(
      {},
      this._filmState,
      update,
    );

    if (justStateUpdating) {
      return;
    }

    this.updateElement();

    if (scrollTopPosition !== null) {
      this.getElement().scrollTop = scrollTopPosition;
    }
  }
}
