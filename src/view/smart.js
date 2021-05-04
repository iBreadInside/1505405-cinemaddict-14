import AbstractView from './abstract.js';

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._state = {};
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement(); // Удаляет старый DOM

    const newElement = this.getElement(); // Создает новый DOM
    parent.replaceChild(newElement, prevElement); // Замена старого новым
    this.restoreHandlers(); // Добавляет обработчики
  }

  updateState(update, justStateUpdating) {
    if (!update) {
      return;
    }

    this._state = Object.assign(
      {},
      this._data,
      update,
    );

    if (justStateUpdating) {
      return;
    }

    this.updateElement();
  }
}
