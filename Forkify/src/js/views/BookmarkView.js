import parentview from './ParentView.js';
import previewView from './previewView.js';
// import icon from 'url:../../img/icons.svg';
class BookmarkView extends parentview {
  parentEl = document.querySelector('.bookmarks__list');
  _ErrorMessage = 'no bookmarks added, add some recipes!';
  _message = '';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new BookmarkView();
