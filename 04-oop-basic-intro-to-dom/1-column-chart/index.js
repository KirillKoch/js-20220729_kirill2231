export default class ColumnChart {
  chartHeight = 50;
  subElements = {};

  constructor(
    {
      data = [],
      label = '',
      value = 0,
      link = '',
      formatHeading = value => value
    } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.render();
  }

  template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.getTitle()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.getBody(this.data)}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const div = document.createElement('div');

    div.innerHTML = this.template();

    this.element = div.children[0];

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    this.subElements = this.getSubElements();
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

  getTitle() {
    return `
      ${this.label}
      ${this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : ''}
    `;
  }

  getBody(data) {
    const array = this.getColumnProps(data);

    return array.map(column => {
      return `<div style="--value: ${column.value}" data-tooltip="${column.percent}"></div>`;
    }).join('');
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;
  
    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  update(data) {
    if (data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    this.subElements.body.innerHTML = this.getBody([...data, ...this.data]);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

}
