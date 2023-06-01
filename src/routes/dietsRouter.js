const { Router } = require("express");
const { getAllDiets, postDiet } = require("./handlers/dietsHandler");

const dietsRouter = Router();

//? GET ALL DIETS ROUTE
dietsRouter.get("/", getAllDiets);

dietsRouter.post("/", postDiet);

module.exports = dietsRouter;
