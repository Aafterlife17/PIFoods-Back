const { Router } = require("express");
const recipesRouter = require("./recipesRouter");
const dietsRouter = require("./dietsRouter");

const mainRouter = Router();

//? RECIPES ROUTES
mainRouter.use("/recipes", recipesRouter);

//? DIETS ROUTES
mainRouter.use("/diets", dietsRouter);

module.exports = mainRouter;
