export default class SortableTable {
  element;
  subElements = {}

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  get template() {
    return `
      <div class="sortable-table ${this.data.length ? '' : 'sortable-table_empty'}">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.getHeader()}
        </div>

        <div data-element="body" class="sortable-table__body">
          ${this.getBody()}
        </div>

        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
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

  getHeader(field = '', order = '') {
    const headerConfig = this.headerConfig;

    return headerConfig.map(({id, sortable, title}) => {
      return `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${id === field ? order : ''}">
          <span>${title}</span>
          ${id === field ? `<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>` : ''}
        </div>
      `;
    }).join('');
  }

  getBody(data = this.data) {
    const headerConfig = this.headerConfig;

    return data.map(product => {
      let row = `<a href="/products/${product.id}" class="sortable-table__row">`;

      headerConfig.forEach(({id, template}) => {
        row += template ? template(product[id]) : `<div class="sortable-table__cell">${product[id]}</div>`;
      });

      return row + `</a>`;
    }).join('');
  }

  sort(field = 'name', param = 'asc') {
    const arr = [...this.data];
    const headerConfig = this.headerConfig;
    const column = headerConfig.find(item => item.id === field);
    const {sortType} = column;

    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[param];

    const newData = arr.sort((value1, value2) => {
      if (sortType === 'string') {
        return direction * value1[field].localeCompare(value2[field], ['ru', 'en'], { caseFirst: 'upper' });
      }

      if (sortType === 'number') {
        return direction * (value1[field] - value2[field]);
      }
    });

    this.subElements.body.innerHTML = this.getBody(newData);
    this.subElements.header.innerHTML = this.getHeader(field, param);
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
