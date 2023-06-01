const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Diet",
    {
      name: {
        type: DataTypes.STRING,
      },
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
