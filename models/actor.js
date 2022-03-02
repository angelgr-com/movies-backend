'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Actor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Actor.init({
    name: DataTypes.STRING,
    birthday: DataTypes.DATEONLY,
    place_of_birth: DataTypes.STRING,
    biography: DataTypes.TEXT,
    img: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Actor',
  });
  return Actor;
};