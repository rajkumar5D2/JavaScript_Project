//CONTROLLER SHOULD ONLY CONTAIN BUSINESS LOGIC NOT APPLICATION LOGIC(RELATED TO HTML, CSS)
import * as model from './model.js';
import RecipeView from './views/recipeView.js';
import 'core-js/stable'; //for polyfilling everything except async, await
import 'regenerator-runtime/runtime'; // for polyfilling async, await
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsview from './views/ResultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/BookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
// console.log(icon);
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// for loading purpose===========================
// if (module.hot) {
//   module.hot.accept();
// }
// LOADING INDIVIDUAL RECIPE USING ID FROM THE HASHCHANGE LISTENER AND THE ITEMS LINKS FROM CONTROLLERSEARCHRESULTS()
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id + ' hi');

    if (!id) return;

    //1)Loading recipe=====================================
    await model.loadRecipe(id);
    // const { recipe } = model.state;
    // console.log(model.state.recipe);
    //2) RENDERING RECIPE==================================
    RecipeView.render(model.state.recipe);
    //servings update======================================
    //0) adding clicked background effects to item link
    resultsview.render(model.recipePerPage());
    bookmarkView.render(model.state.bookmark); // adding clicked background effects to item link in bookmarks section
    // controllServings();
  } catch (err) {
    console.error(`${err} from controller`);
    recipeView.renderError();
    // bookmarkView.renderError();
  }
};
//FOR SEARCHING ITEM AND GETTING ITS RELATED DISHES========
const controllerSearchResults = async function () {
  try {
    resultsview.renderSpinner();
    // console.log(resultsview);
    // console.log(searchView.query);
    const query = searchView.getQuery(); //getting query from search bar(since it contains dom elements we cant writee in controller)
    await model.loadSearchResults(query); //calling actual search function which is in model with the query we get from searchView.js
    // console.log(model.state.searchData.results);
    if (model.state.searchData.results.length === 0) throw new Error();
    // resultsview.render(model.state.searchData.results);//loads all recipes
    model.state.searchData.page = 1; // resetting page to 1 since we r saving the page number in mode to state objectl
    resultsview.render(model.recipePerPage()); //getting 10 items per page for the first time
    // paginationView._generateMarkup();
    paginationView.render(model.state.searchData); //setting page numbers logic and its html code for the first time
    // paginationView.nextt();
    // console.log(paginationView.next);
  } catch (err) {
    // console.error(err);
    resultsview.renderError();
  }
};
//FOR PAGINATION===================================================================================
const controllerHandler = function (page) {
  resultsview.render(model.recipePerPage(page)); //getting next 10 items per page if we clicked the page numbers
  paginationView.render(model.state.searchData); //setting next/previous page numbers logic and its html code
};

// searchView.btn.addEventListener('click', controllerSearchResults); //dom code for button should be in views and calling the search functionality after clicking the search button
// showRecipe();
// window.addEventListener('hashchange', showRecipe);
//CHANGING THE SERVINGS ALSO CHANGE THE QUANTITY OF INGREDIENTS================
const controllServings = function (newServings) {
  model.changeServings(newServings);
  RecipeView.render(model.state.recipe);
};
//BOOKMARK LOGIC===================================================================================
const controlBookmark = function () {
  //ADDING/REMOVING BOOKMARK=========================================
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //RENDERING RECIPE VIEW WITH BOOKMARK LOGIC========================
  RecipeView.render(model.state.recipe);
  //BOOKMARK SECTION RENDERING=======================================
  bookmarkView.render(model.state.bookmark);
};
//DISPLAYING BOOKMARKS IN THE BOOKMARK SECTION=====================================================
const controlBookmarkHandler = function () {
  bookmarkView.render(model.state.bookmark);
};
//ADD RECIPE LOGIC CONTROLLER======================================================================
const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe); //sending the user uploaded recipe to model for getting its ingredients from object to array
    //render recipe
    recipeView.render(model.state.recipe);
    //success message
    addRecipeView.renderSpinner();
    addRecipeView.renderMessage();
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // addRecipeView.looping();

    //BOOKMARK SECTION RENDERING=======================================
    // bookmarkView.render(model.state.bookmark);
    // //success message==================================================
    // addRecipeView.uploadBtn.addEventListener('click', function () {
    //   addRecipeView.renderMessage();
    // });
    //closing the add recipe window
    // setTimeout(function () {
    //   addRecipeView.toggleWindow();
    //   location.reload();
    // }, 5000);
    //success message
  } catch (err) {
    console.error(err.message);
    addRecipeView.renderError(err);
  }
};
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlderUpdateServings(controllServings);
  searchView.addHandler(controllerSearchResults);
  recipeView.addHandlerAddBookmark(controlBookmark);
  paginationView.pageNumberClickHandler(controllerHandler);
  bookmarkView.addHandlerRender(controlBookmarkHandler);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
