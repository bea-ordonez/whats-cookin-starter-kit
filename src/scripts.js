import './styles.css';
import fetchData from './apiCalls';
import RecipeRepository from '../src/classes/RecipeRepository';
import Recipe from './classes/Recipe';
import User from './classes/User';
import './images/Sophie.png';
import './images/Bea.png';
import './images/Shane.png';
import './images/Winston.png';

// Variables
const searchBarBtn = document.querySelector('#searchBtn');
const savedViewBtn = document.querySelector('#savedViewBtn');
const homeViewBtn = document.querySelector('#homeViewBtn');
const infoBtn = document.querySelector('#infoBtn');

const cardTileDisplay = document.querySelector('#cardTileView');
const singleRecipeDisplay = document.querySelector('#singleRecipeView');
const savedRecipesDisplay = document.querySelector('#savedRecipesView');
const creatorDisplay = document.querySelector('#creatorInfoPage');
const welcomeHeader = document.querySelector('#welcomeHeader');
const mainBucket = document.querySelector('main');

const insertUserName = document.querySelector('#userName');
const searchBarInput = document.querySelector('#searchBar');
const searchResultsDisplay = document.querySelector('#searchResultsView');
var savedRecipes = [];

// Promise
Promise.all([fetchData('users'), fetchData('ingredients'), fetchData('recipes')])
.then(vals => {
  let userData = vals[0].users;
  let ingredientsData = vals[1].ingredients;
  let recipesData = vals[2].recipes;
  let recipeRepo = new RecipeRepository(recipesData, ingredientsData);
  insertRecipeCards(recipesData, cardTileDisplay);
  let thisUser = getRandomUser(userData);
  
  mainBucket.addEventListener('click', (event) => {
    if(event.target.classList == 'open-single-recipe') {
      showSingleRecipe(event, recipeRepo, ingredientsData);
    };
    if (event.target.classList == 'save-recipe-btn') {
      saveRecipe(event, recipesData, thisUser)
    };
  });
});

function saveRecipe(event, array, user) {
  let matchedById = array.find((recipe) => recipe.id == event.target.id);
  let checkForDupes = user.recipesToCook.map(rec => rec.id);
  if (!checkForDupes.includes(matchedById.id)) {
    user.addRecipeToCook(matchedById, array);
    savedRecipes = user.recipesToCook;
  };
};

function deleteRecipe(event, array) {
  const recipeObj = event.target.parentNode
  array.splice(recipeObj, 1)
};


// Event Listeners
homeViewBtn.addEventListener('click', () => {
  showHomeView();
});

searchBarInput.addEventListener('change', () => {
  // cardTileDisplay.innerHTML = "";    
  getRecipeBySearch();
});

searchBarBtn.addEventListener('click', function() {
  // cardTileDisplay.innerHTML = "";
  getRecipeBySearch();
});

savedViewBtn.addEventListener('click', () => {
  // cardTileDisplay.innerHTML = "";
  showSavedRecipes();
});

infoBtn.addEventListener('click', showCreatorInfo);
// Event handlers 

function getRecipeBySearch() {
  show([homeViewBtn, searchResultsDisplay, savedViewBtn]);
  hide([cardTileDisplay, singleRecipeDisplay, creatorDisplay]);
  let filterResults = [];
  let userInput = searchBarInput.value;
  Promise.all([fetchData('recipes'), fetchData('ingredients')]).then(data => {
    let freshRepo = new RecipeRepository(data[0].recipes, data[1].ingredients);
    filterResults = freshRepo.filterByName(userInput).concat(freshRepo.filterByTag(userInput));
    let removedDupes = [];
    filterResults.forEach(foundRecipe => {
      removedDupes.includes(foundRecipe) ? console.log('There can be only one') : removedDupes.push(foundRecipe)
    })
    console.log('No Dupes', removedDupes);
    removedDupes.forEach(result => {
      searchResultsDisplay.innerHTML += `<section class="nameResults"><h1 class="searched-recipe" id=${result.id}></h1></section>`
    });
    insertRecipeCards(removedDupes, searchResultsDisplay);
  })
};

function insertRecipeCards(array, element) {
  console.log(array)
  for(let i = 0; i < array.length; i++) {
    element.innerHTML += 
      `<section class="card">
      <h2>${array[i].name}</h2>
      <img src="${array[i].image}" alt="image of ${array[i].name}">
      <div class="card-buttons">
        <button class="open-single-recipe" id="${array[i].id}">View Recipe</button>
        <button class="save-recipe-btn" id="${array[i].id}">Save Recipe</button>
        <button class="delete-recipe-btn hidden" id="${array[i].id}">Delete Recipe</button>
      </div>
      </section>`;
  };
};

function showSingleRecipe(event, repo, ingredients) {
  show([singleRecipeDisplay, homeViewBtn, savedViewBtn]);
  hide([cardTileDisplay, creatorDisplay, savedRecipesDisplay]);
  let fetchedIng = ingredients;
  const element = event.target.id;
  const foundRecipe = repo.findRecipe(element);
  foundRecipe.todosIngredients = fetchedIng;
  let foundIngredients = foundRecipe.retrieveIngredientInfo();
  let foundInstructions = foundRecipe.giveInstructionsForRecipe();
  singleRecipeDisplay.innerHTML = 
  `<section class="single-recipe" id="${foundRecipe.id}">
  <h2>${foundRecipe.name}</h2>
  <img src="${foundRecipe.image}" alt="image of ${foundRecipe.name}">
  <div class="rating">
    <input type="radio" name="rating" value="5" id="5"><label for="5">☆</label>
    <input type="radio" name="rating" value="4" id="4"><label for="4">☆</label>
    <input type="radio" name="rating" value="3" id="3"><label for="3">☆</label>
    <input type="radio" name="rating" value="2" id="2"><label for="2">☆</label>
    <input type="radio" name="rating" value="1" id="1"><label for="1">☆</label>
  </div>
  <h3>Ingredients</h3>
  <div class="ingredients">
    <p>${foundIngredients.map((ing) => ` ${ing.name} `)}</p>
  </div>
  <h3>Instructions</h3>
  <div class="instructions">
    <p>${foundInstructions.map((inst) =>` ${inst} `)}</p>
  </div>
  </section>`
};

function getRandomUser(userInfo) {
  let randomIndex = Math.floor(Math.random() * userInfo.length);
  let currentUser = new User(userInfo[randomIndex]);
  insertUserName.innerHTML = `${currentUser.name}`;
  return currentUser
};

// Functions
function showHomeView() {
  show([cardTileDisplay, savedViewBtn, welcomeHeader, infoBtn]);
  hide([singleRecipeDisplay, homeViewBtn, creatorDisplay, savedRecipesDisplay]);
  // cardTileDisplay.innerHTML = "";
  Promise.all([fetchData('recipes')]).then(data => insertRecipeCards(data[0].recipeData, cardTileDisplay))
};

function showSavedRecipes() {
  show([homeViewBtn, savedRecipesDisplay, infoBtn]);
  hide([savedViewBtn, creatorDisplay, cardTileDisplay, singleRecipeDisplay]);
  savedRecipesDisplay.innerHTML = "";
  insertRecipeCards(savedRecipes, savedRecipesDisplay);
};

function showCreatorInfo() {
  show([creatorDisplay, homeViewBtn, savedViewBtn]);
  hide([cardTileDisplay, welcomeHeader, singleRecipeDisplay, savedRecipesDisplay, infoBtn]);
};

function show(array) {
  const showElements = array.map(element => element.classList.remove('hidden'));
  return showElements;
};
  
function hide(array) {
  const hideElements = array.map(element => element.classList.add('hidden'));
  return hideElements;
};