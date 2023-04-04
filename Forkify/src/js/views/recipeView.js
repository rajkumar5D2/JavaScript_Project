import icon from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import ParentView from './ParentView.js';
class RecipeView extends ParentView {
  parentEl = document.querySelector('.recipe');

  _ErrorMessage = 'We could not find the item, please try again later!';
  _message = ''; //for later in future purpose(success message)

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }
  addHandlderUpdateServings(handler) {
    this.parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const updateTo = +btn.dataset.updateTo;
      console.log(updateTo);
      if (updateTo <= 0 || updateTo > 10) return;
      handler(updateTo);
    });
  }
  addHandlerAddBookmark(handler) {
    this.parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }
  _generateMarkup() {
    return ` 
        <figure class="recipe__fig">
          <img src="${this._data.imageUrl}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icon}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icon}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings - 1
              }">
                <svg>
                  <use href="${icon}.svg#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icon}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icon}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark " >
            <svg class="">
              <use href="${icon}.svg#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe Ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.ingredients
            .map(res => {
              return ` <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icon}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                res.quantity ? new Fraction(res.quantity).toString() : ''
              }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${res.unit}</span>
                ${res.description}
              </div>
            </li>`;
            })
            .join('')}                   
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }
}
export default new RecipeView();
