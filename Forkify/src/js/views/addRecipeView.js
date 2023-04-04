import parentview from './ParentView.js';

class AddRecipeView extends parentview {
  _overlay = document.querySelector('.overlay');
  _window_btn = document.querySelector('.add-recipe-window');
  _btn_close = document.querySelector('.btn--close-modal');
  parentEl = document.querySelector('.upload');
  _addRecipe_btn = document.querySelector('.nav__btn--add-recipe');
  _message = 'recipe added succesfully';
  uploadBtn = document.querySelector('.upload__btn');
  inputFields = document.querySelectorAll('input');
  clearForm() {
    this.parentReset.res;
  }
  constructor() {
    //to start them as soon as object created
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }
  looping() {
    //making all the form fields empty coz of the bug im getting(but no use)
    console.log(this.inputFields);
    this.inputFields.forEach(input => {
      input.value = '';
    });
    // console.log(this.inputFields);
  }
  toggleWindow() {
    //since this kw wont represent to global variables inside event handler taking new function and calling inside callback function

    this._overlay.classList.toggle('hidden');
    this._window_btn.classList.toggle('hidden');
    // this.renderMessage();
  }
  _addHandlerShowWindow() {
    // for opening add recipe window
    this._addRecipe_btn.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerCloseWindow() {
    //for closing add recipe window
    this._btn_close.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    // this.renderMessage();
  }
  addHandlerUpload(handler) {
    // for upload button

    this.parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      try {
        const dataArray = [...new FormData(this)]; //getting all the form attribures like name and its values in a unknown format and making an array([]) by spreading(...) them
        const data = Object.fromEntries(dataArray); //converts the entries of array to object(oppo to Object.entries() which converts object to array)
        handler(data); //sending converted array to object new recipe to controller and there by sending to model for furthur conversions
      } catch (err) {
        console.error(err);
      }
    });
  }
}
export default new AddRecipeView();
