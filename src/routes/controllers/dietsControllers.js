require("dotenv").config();
const axios = require("axios");
const { Diet } = require("./../../db");
const { KEY } = process.env;

//? GET ALL DIETS CONTROLLER
const allDiets = async () => {
  let diets = [];
  let infoApi;
  const query = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${KEY}&addRecipeInformation=true&number=40`;
  infoApi = await axios.get(query);
  infoApi.data.results.forEach((recipe) => {
    if (recipe.diets.length > 0) {
      recipe.diets.forEach((diet) => {
        if (!diets.includes(diet)) {
          diets.push(diet);
        }
      });
    }
  });

  diets.forEach(async (diet) => {
    const existingDiet = await Diet.findOne({ where: { name: diet } });
    if (!existingDiet) {
      await Diet.create({ name: diet });
    }
  });
  let dietsBD = await Diet.findAll();
  if (dietsBD.length === 0) {
    dietsBD = await Diet.findAll();
  }
  return dietsBD;
};

const createDiet = async (id, name) => {
  const newDiet = await Diet.create({
    id: id,
    name: name,
  });
  return newDiet;
};

module.exports = { allDiets, createDiet };
