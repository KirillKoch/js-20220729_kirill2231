export default class SortableTable {
  element;
  subElements = {}

  onSortClick = event => {
    const column = event.target.closest('[data-sortable=true]');

    const toggleOrder = order => {
      const orders = {
        'asc': 'desc',
        'desc': 'asc'
      };

      return orders[order];
    };

    if (column) {
      const { id, order } = column.dataset;
      const newOrder = toggleOrder(order);
      column.dataset.order = newOrder;

      const arrow = column.querySelector('.sortable-table__sort-arrow');

      if (!arrow) {
        column.append(this.subElements.arrow);
      }

      this.sort({id: id, order: newOrder});
    }
  }

  constructor(headerConfig = [], {
    data = [],
    sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    isSortLocally = true
  } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;

    this.render();
  }

  getTable(data) {
    return `
      <div class="sortable-table ${this.data.length ? '' : 'sortable-table_empty'}">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.getHeader()}
        </div>

        <div data-element="body" class="sortable-table__body">
          ${this.getBody(data)}
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

  initialize() {
    const header = this.subElements.header;

    header.addEventListener('pointerdown', this.onSortClick);
  }

  render() {
    const sortData = this.sortData(this.sorted);
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTable(sortData);

    this.element = wrapper.children[0];
    this.subElements = this.getSubElements();

    this.initialize();
  }

  getHeader() {
    const headerConfig = this.headerConfig;

    return headerConfig.map(({id, sortable, title}) => {
      const order = this.sorted.id === id ? this.sorted.order : 'asc';

      return `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
          <span>${title}</span>
          ${this.getHeaderSortingArrow(id)}
        </div>
      `;
    }).join('');
  }

  getHeaderSortingArrow(id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : "";

    return isOrderExist
      ? `
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow">
          </span>
        </span>
      `
      : '';
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

  sortData({id, order} = {}) {
    const arr = [...this.data];
    const headerConfig = this.headerConfig;
    const column = headerConfig.find(item => item.id === id);
    const { sortType }  = column;

    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[order];

    return arr.sort((a, b) => {
      switch (sortType) {
      case 'string':
        return direction * a[id].localeCompare(b[id], ['ru', 'en'], { caseFirst: 'upper' });
      case 'number':
        return direction * (a[id] - b[id]);
      default:
        throw new Error(`Неизвестный тип сортировки ${sortType}`);
      }
    });
  }

  sort(sorted) {
    this.subElements.body.innerHTML = this.getBody(this.sortData(sorted));
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
