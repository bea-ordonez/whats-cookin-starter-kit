import Recipe from "./Recipe";

class User {
  constructor(userInfo){
    this.name = userInfo.name;
    this.id = userInfo.id;
    this.pantryItems = userInfo.pantry;
    this.recipesToCook = [];
  };

  addRecipeToCook(item) {
    this.recipesToCook.push(new Recipe(item));
    return this.recipesToCook.recipeList;  
  };

  removeRecipeFromCook(item) {
    this.recipesToCook.splice(item, 1);
    return this.recipesToCook.recipeList;
  };

  findByTag(tag) {
    const findByTag = this.recipesToCook.filter(recipe => recipe.tags.includes(tag));
    return findByTag;
  };

  findByName(foodName) {
    const findByName = this.recipesToCook.filter(recipe => recipe.name === foodName);
    return findByName;
  };
};

export default User;