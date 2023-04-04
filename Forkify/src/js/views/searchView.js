//ALL THE VIEW CODE(RELATED TO HTML, CSS SHOULD BE HERE)
class SearchResult {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }
  addHandler(handle) {
    const btn = document.querySelector('.search__btn');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      handle();
    });
  }
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
}
export default new SearchResult();
