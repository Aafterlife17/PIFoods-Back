const { allRecipes, newRecipe } = require("../controllers/recipesControllers");

//? GET ALL RECIPES HANDLER
const getAllRecipes = async (req, res) => {
  try {
    const { name } = req.query;
    const recipes = await allRecipes();
    if (name) {
      const recipeName = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(name.toLowerCase())
      );
      if (recipeName.length) {
        res.status(200).send(recipeName);
      } else {
        res
          .status(400)
          .send("Oops! That recipe doesn't exist. Try another one!");
      }
    } else {
      res.status(200).send(recipes);
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

//? GET RECIPE BY ID HANDLER
const getRecipeById = async (req, res) => {
  const { id } = req.params;
  const recipesTotal = await allRecipes();
  if (id) {
    const recipeId = await recipesTotal.filter((recipe) => recipe.id == id);
    recipeId.length
      ? res.status(200).send(recipeId)
      : res
          .status(400)
          .send("Oops! That recipe doesn't exist. Try another one!");
  }
};

//? CREATE RECIPE HANDLER
const createRecipe = async (req, res) => {
  try {
    const { name, image, summary, healthScore, instructions, diets } = req.body;
    const postRecipe = await newRecipe(
      name,
      image,
      summary,
      healthScore,
      instructions,
      diets
    );
    res.status(200).json(postRecipe);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
};
