require("dotenv").config();
const axios = require("axios");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const { Recipe, Diet } = require("./../../db");
const { KEY, URL } = process.env;

//? GET RECIPES API CONTROLLER
const recipesAPI = async () => {
  const apiURL = await axios.get(
    `${URL}complexSearch?apiKey=${KEY}&addRecipeInformation=true&number=100`
  );
  const recipes = apiURL.data.results.map((result) => {
    const steps = result.analyzedInstructions.flatMap((instruction) =>
      instruction.steps.map((step) => step.step)
    );
    return {
      id: result.id,
      name: result.title,
      image: result.image,
      summary: result.summary.substring(0, 300),
      healthScore: result.healthScore,
      instructions: steps,
      Diets: result.diets.map((diet) => ({ name: diet })),
    };
  });
  return recipes;
};

//? GET RECIPES DB CONTROLLER
const recipesDB = async () => {
  const recipes = await Recipe.findAll({
    include: {
      model: Diet,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
    order: [["createdAt", "DESC"]],
  });
  return recipes;
};

// //? GET ALL RECIPES CONTROLLER (promises)
const allRecipes = () => {
  return recipesDB().then((recipesDB) => {
    return recipesAPI().then((recipesAPI) => {
      const recipesTotal = recipesDB.concat(recipesAPI);
      return recipesTotal;
    });
  });
};

// //? GET ALL RECIPES CONTROLLER (async/await)
// const allRecipes = async () => {
//   const allRecipesDB = await recipesDB();
//   const allRecipesAPI = await recipesAPI();
//   const recipesTotal = allRecipesDB.concat(allRecipesAPI);
//   return recipesTotal;
// };

//? CREATE RECIPE CONTROLLER
const newRecipe = async (
  name,
  image,
  summary,
  healthScore,
  instructions,
  diets
) => {
  const recipeDB = await Recipe.findAll({
    where: {
      name: {
        [Op.iLike]: `%${name}%`,
      },
    },
  });

  if (recipeDB.length)
    return "Oops, that recipe already exists! Please create a new one";

  const newRecipe = await Recipe.create({
    name: name,
    image: image,
    summary: summary,
    healthScore: healthScore,
    instructions: instructions,
  });

  const dietDB = await Diet.findAll({
    where: { name: diets },
  });

  newRecipe.addDiets(dietDB);
};

module.exports = {
  allRecipes,
  newRecipe,
};
