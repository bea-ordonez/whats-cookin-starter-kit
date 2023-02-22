import { assert, expect } from 'chai';
import Recipe from '../src/classes/Recipe';
import recipeTestData from '../src/data/recipeTestData';

describe('Recipe', () => {
  let recipe1, recipe2;

  beforeEach(() => {
    recipe1 = new Recipe(recipeTestData[0]);
    recipe2 = new Recipe(recipeTestData[1]);
  });

  assert.isFunction(Recipe);
  it.skip('should be a function', () => {
  });

  it.skip('should be able to create an instance of Recipe', () => {
    assert.instanceOf(recipe1, Recipe);
  });

  it.skip('should contain its own ID number', () => {
    assert.equal(recipe1.id, 595736);
  });

  it.skip('should contain the image path of a particular recipe preview', () =>{
    assert.equal(recipe1.image, recipeTestData[0].image);
  });

  it.skip('should contain the ingredients used to make each recipe', () => {
    assert.equal(recipe1.ingredients, recipeTestData[0].ingredients);
  });

  it.skip('should contain the instructions to follow to create it', () => {
    assert.equal(recipe1.instructions, recipeTestData[0].instructions);
  });

  it.skip('should have a name', () => {
    assert.equal(recipe1.name, recipeTestData[0].name);
  });

  it.skip('should contain recipe tags', () => {
    assert.equal(recipe1.tags, recipeTestData[0].tags);
  });

  it.skip('should be able to return a list of its ingredients', () => {
    assert.equal(recipe1.ingredients, recipeTestData[0].ingredients);
    recipe1.retrieveIngredientInfo();
    assert.notEqual(recipe1.ingredients, recipeTestData[0].ingredients);
  });

  it.skip('should be able to return the total cost of its own ingredients', () => {
    recipe1.retrieveIngredientInfo();
    const getSum1 = recipe1.returnCostOfIngredients();
    assert.equal(getSum1, 177.76);

    recipe2.retrieveIngredientInfo();
    const getSum2 = recipe2.returnCostOfIngredients();
    assert.equal(getSum2, 272.97);
  });

  it.skip('should be able to return the instructions to make a recipe', () => {
    recipe1.retrieveIngredientInfo();
    recipe1.giveInstructionsForRecipe();
    const instruc = 'Step 2: Add egg and vanilla and mix until combined.';
    assert.equal(recipe1.instructions[1], instruc);
  });
});