require('dotenv').config();
const axios = require('axios');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;
const { Recipe, Diet } = require('./../../db');
const { KEY, URL } = process.env;

//? GET RECIPES API CONTROLLER
const recipesAPI = async () => {
  const apiURL = await axios.get(
    `${URL}complexSearch?apiKey=${KEY}&addRecipeInformation=true&number=100`
  );

  const results = apiURL.data?.results || [];

  const recipes = results.map((result) => {
    // analyzedInstructions puede venir undefined o []
    const steps = (result.analyzedInstructions || []).flatMap((instruction) =>
      (instruction.steps || []).map((step) => step.step)
    );

    const dietsArray = Array.isArray(result.diets) ? result.diets : [];

    return {
      id: result.id,
      name: result.title,
      image: result.image,
      summary: result.summary
        ? result.summary.substring(0, 300)
        : 'No summary available',
      healthScore: result.healthScore ?? 0,
      instructions: steps, // o steps.join(" ") si el front espera string
      Diets: dietsArray.map((diet) => ({ name: diet })),
    };
  });

  return recipes;
};

//? GET RECIPES DB CONTROLLER
const recipesDB = async () => {
  const recipes = await Recipe.findAll({
    include: {
      model: Diet,
      attributes: ['name'],
      through: {
        attributes: [],
      },
    },
    order: [['createdAt', 'DESC']],
  });
  return recipes;
};

//? GET ALL RECIPES CONTROLLER (async/await, más prolijo)
const allRecipes = async () => {
  const allRecipesDB = await recipesDB();
  const allRecipesAPI = await recipesAPI();
  const recipesTotal = allRecipesDB.concat(allRecipesAPI);
  return recipesTotal;
};

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
    return 'Oops, that recipe already exists! Please create a new one';

  const newRecipe = await Recipe.create({
    name,
    image,
    summary,
    healthScore,
    instructions,
  });

  const dietDB = await Diet.findAll({
    where: { name: diets },
  });

  await newRecipe.addDiets(dietDB);
  return newRecipe; // así el handler puede devolver algo útil
};

module.exports = {
  allRecipes,
  newRecipe,
};
