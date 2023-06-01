require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_RAILWAY } = process.env;

// `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/food`

const sequelize = new Sequelize(DB_RAILWAY, {
  logging: false,
  native: false,
});
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

modelDefiners.forEach((model) => model(sequelize));
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Recipe } = sequelize.models;
const { Diet } = sequelize.models;

Recipe.belongsToMany(Diet, { through: "recipe_diet" });
Diet.belongsToMany(Recipe, { through: "recipe_diet" });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
