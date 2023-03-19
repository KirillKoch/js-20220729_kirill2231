export default class NotificationMessage {
  static wrapper;

  subElements = {};
  element;
  timer;

  constructor(message,
    { 
      duration = 2000,
      type = 'success'
    } = {}
  ) {
    this.message = message;
    this.durationToSecond = (duration / 1000) + 's';
    this.duration = duration;
    this.type = type;

    this.render();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${this.durationToSecond}">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header" data-element="header">${this.type}</div>
          <div class="notification-body" data-element="body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const div = document.createElement('div');

    div.innerHTML = this.template;

    this.element = div.children[0];

    this.subElements = this.getSubElements();
  }

  show(parent = document.body) {
    if (NotificationMessage.wrapper) {
      NotificationMessage.wrapper.remove();
    }

    parent.append(this.element);

    this.timer = setTimeout(() => this.remove(), this.duration);

    NotificationMessage.wrapper = this;
  }

  getSubElements() {
    const result = {};
    const subElements = this.element.querySelectorAll('[data-element]');

    for (let subElement of subElements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  remove() {
    clearTimeout(this.timer);

    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage.wrapper = null;
    this.subElements = {};
  }
}
