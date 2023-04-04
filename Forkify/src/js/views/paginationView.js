import parentview from './ParentView.js';
import icon from 'url:../../img/icons.svg';
class PaginationView extends parentview {
  parentEl = document.querySelector('.pagination');
  //getting page munber========================
  pageNumberClickHandler(handler) {
    this.parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      // console.log(btn);
      if (!btn) return;
      const gotoPage = Number(btn.dataset.goto);
      // console.log(gotoPage);
      handler(gotoPage);
    });
  }
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.itemsPerPage
    );
    // console.log(this._data);
    // console.log(numPages);

    //page 1 with  other pages===================
    if (this._data.page === 1 && numPages > 1) {
      return ` <button data-goto="${
        this._data.page + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }

    //last page====================================
    if (numPages === this._data.page && numPages > 1) {
      return `  <button data-goto="${
        this._data.page - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>`;
    }
    //other page in the middle=====================
    if (this._data.page > 1 && this._data.page < numPages) {
      return ` <button data-goto="${
        this._data.page + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-right"></use>
            </svg>
          </button>
           <button data-goto="${
             this._data.page - 1
           }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button`;
    }
    //page 1 with no other pages======================
    return '';
  }
}
export default new PaginationView();
