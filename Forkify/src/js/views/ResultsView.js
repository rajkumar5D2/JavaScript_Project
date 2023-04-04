import parentview from './ParentView.js';
import icon from 'url:../../img/icons.svg';
class ResultsView extends parentview {
  parentEl = document.querySelector('.results');
  _ErrorMessage = 'no recipes found, please try again later!!!';
  _message = '';
  _generateMarkup() {
    // console.log(this._data);
    return this._data.map(this.generateMarkupPreview).join('');
  }
  generateMarkupPreview(result) {
    const id = window.location.hash.slice(1);
    // console.log(id, result.id);
    return ` <li class="preview">
            <a class="preview__link  ${
              result.id === id ? 'preview__link--active' : ''
            }" href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.imageUrl}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
               <div class="preview__user-generated ${
                 result.key ? '' : 'hidden'
               }">
            <svg>
              <use href="${icon}#icon-user"></use>
            </svg>
          </div>
          
                </div>
            </a>
          </li>`;
  }
}
export default new ResultsView();
