import { API_URL, RECIPE_PER_PAGE, KEY } from './config.js';
import { getJson } from './helpers';
import { sendJson } from './helpers';

export const state = {
  recipe: {},
  searchData: {
    query: '',
    results: [],
    itemsPerPage: RECIPE_PER_PAGE,
    page: 1,
  },
  bookmark: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data; //destructuring object since both have same name(recipe)
  return {
    //removing underscore(_) from data.data.recipe 'properties' and defining them without underscore
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    imageUrl: recipe.image_url,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    ...(recipe.key && { key: recipe.key }), //short circuting (same as "key:recipe.key" i.e 'if recipe.key' exist 'return {key:recipe.key}' and spread that object to get just the key:recipe.key as a property and value)
  };
};
//loading each recipe details using id(from hash change listener)==================================
export const loadRecipe = async function (id) {
  try {
    const data = await getJson(`${API_URL}/${id}`);

    // console.log(recipe);
    state.recipe = createRecipeObject(data);
    if (state.bookmark.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.error(`${err},from model`);
    throw err;
  }
};
//CHANGING THE INGREDIENTS ACCORDING TO SERVINGS===================================================
export const changeServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServings / state.recipe.servings);
  });
  state.recipe.servings = newServings;
};
//GETTING RECIPE DATA USING QUERY FROM SEARCH BOX==================================================
export const loadSearchResults = async function (query) {
  state.searchData.query = query;
  const data = await getJson(`${API_URL}?search=${query}&key=${KEY}`);
  // console.log(data.data.recipes.length);
  state.searchData.results = data.data.recipes.map(res => {
    return {
      id: res.id,
      imageUrl: res.image_url,
      publisher: res.publisher,
      title: res.title,
      ...(res.key && { key: res.key }),
    };
  });

  // console.log(state.searchData);
};
// loadSearchResults('pizza');
//PAGINATION RESULTS===============================================================================
export const recipePerPage = function (page = state.searchData.page) {
  state.searchData.page = page; //saving the page number to state object
  const start = (page - 1) * state.searchData.itemsPerPage; //(1-1)*10=0
  const end = page * state.searchData.itemsPerPage; //1*10=10
  // console.log(state.searchData.page);
  return state.searchData.results.slice(start, end); //cutting just 10(0-10) items from the result array
};
//BOOKMARK SAVING TO STATE OBJECT==================================================================
export const addBookmark = function (recipe) {
  //adding bookmark===================================================
  state.bookmark.push(recipe);
  //comparing bookmarked recipe to the current recipe================
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  localBookmark();
  console.log('added');
};
export const deleteBookmark = function (id) {
  const index = state.bookmark.findIndex(el => el.id === id);
  state.bookmark.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  localBookmark();
};
//SAVING RECIPE AS A STRING INTO LOCAL STORAGE IN BROWSER============
const localBookmark = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmark));
};
//RETRIEVING STRING FORMATTED RECIPE FROM LOCAL STORAGE TO A VARIABLE(bookmarkRetrieved) and converting back to object
const init = function () {
  const bookmarkRetrieved = localStorage.getItem('bookmark');
  if (bookmarkRetrieved) state.bookmark = JSON.parse(bookmarkRetrieved);
};
init();
//CLEARING BOOKMARKS WHEN WE CALL THE BELOW FUNCTION==================
const clearBookmark = function () {
  localStorage.clear('bookmark');
};
// clearBookmark();
//EXTRACTING INGREDIENTS PROPERTIES FROM THE CONVERTED  NEW RECIPE OBJECT AND FORMING AN ARRAY OF INGREDIENTS
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '') //filtering array with only ingredients properties and which are not empty
      .map(ing => {
        //returning new object of newly generated array by map function with only filtered ingredients array value(which is in 1 index)
        const ingArray = ing[1] //destructuring each splitted text to their respective variables
          .replaceAll(' ', '') //removing whitespace
          .split(','); //splitting text
        if (ingArray.length !== 3) {
          throw new Error(
            `wrong input of ingredients! please give all the ingredients in "${ing[0]}"`
          );
        } else {
          [quantity, unit, description] = ingArray;
        }
        return {
          quantity: quantity ? +quantity : null,
          unit: unit ? unit : '-',
          description: description ? description : '-',
        }; //returning object type of destructured variables
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(KEY, recipe);
    const data = await sendJson(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe); //adding new recipe to bookmarks
  } catch (err) {
    throw err;
  }
};
