const { allDiets, createDiet } = require("./../controllers/dietsControllers");

//? GET ALL DIETS HANDLER
const getAllDiets = async (req, res) => {
  try {
    const allDietsAPI = await allDiets();
    res.status(200).send(allDietsAPI);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const postDiet = async (req, res) => {
  try {
    const { id, name } = req.body;
    const newDiet = await createDiet(id, name);
    res.status(200).send(newDiet);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { getAllDiets, postDiet };
