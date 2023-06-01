const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Recipe", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    healthScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
      },
    },

    instructions: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    createdInDB: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });
};
