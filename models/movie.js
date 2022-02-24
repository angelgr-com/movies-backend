'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Movie.init({
    popularity: DataTypes.DECIMAL,
    poster_path: DataTypes.STRING,
    release_date: DataTypes.STRING,
    title: DataTypes.STRING,
    video: DataTypes.STRING,
    vote_average: DataTypes.DECIMAL,
    vote_count: DataTypes.DECIMAL,
    id_genre: DataTypes.INTEGER,
    id_actor: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};