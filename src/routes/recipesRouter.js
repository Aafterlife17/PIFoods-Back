const { Router } = require("express");
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
} = require("./handlers/recipesHandler");

const recipesRouter = Router();

//? GET ALL RECIPES ROUTE
recipesRouter.get("/", getAllRecipes);

//? GET RECIPE BY ID ROUTE
recipesRouter.get("/:id", getRecipeById);

//? CREATE RECIPE ROUTE
recipesRouter.post("/", createRecipe);

module.exports = recipesRouter;
