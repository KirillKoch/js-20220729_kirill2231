export default class Tooltip {
    static instance;

    element;

    onPointerOver = event => {
      const element = event.target.closest('[data-tooltip');

      if (element) {
        this.render(element.dataset.tooltip);

        document.addEventListener('pointermove', this.onPointerMove);
        document.addEventListener('pointerout', this.onPointerOut);
      }
    }

    onPointerOut = event => {
      this.remove();

      document.removeEventListener('pointermove', this.onPointerMove);
      document.removeEventListener('pointerout', this.onPointerOut);
    }

    onPointerMove = event => {
      this.moveTooltip(event);
    }
  
    constructor() {
      if (Tooltip.instance) {
        return Tooltip.instance;
      }

      Tooltip.instance = this;
    }
  
    template(content) {
      return `
        <div class="tooltip">${content}</div>
      `;
    }

    initialize() {
      this.initEventListeners();
    }
  
    initEventListeners() {
      document.addEventListener('pointerover', this.onPointerOver);
    }
  
    render(content) {
      const div = document.createElement('div');
  
      div.innerHTML = this.template(content);
  
      this.element = div.children[0];

      document.body.append(this.element);
    }

    moveTooltip(event) {
      const shift = 10;
      const clientY = event.clientY + shift;
      const clientX = event.clientX + shift;

      this.element.style.top = clientY + 'px';
      this.element.style.left = clientX + 'px';
    }
  
    remove() {
      if (this.element) {
        this.element.remove();
      }
    }
  
    destroy() {
      this.remove();
      this.element = null;
      document.removeEventListener('pointerover', this.onPointerOver);
      document.removeEventListener('pointermove', this.onPointerMove);
      document.removeEventListener('pointerout', this.onPointerOut);
    }
} 