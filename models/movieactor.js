'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MovieActor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Movie, {
        foreignKey: 'id_movie'
      });
      this.belongsTo(models.Actor, {
        foreignKey: 'id_actor'
      });
    }
  }
  MovieActor.init({
    id_movie: DataTypes.INTEGER,
    id_actor: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MovieActor',
  });
  return MovieActor;
};