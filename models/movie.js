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
    title: DataTypes.STRING,
    tmdb_id: DataTypes.STRING,
    imdb_id: DataTypes.STRING,
    facebook_id: DataTypes.STRING,
    instagram_id: DataTypes.STRING,
    twitter_id: DataTypes.STRING,
    popularity: DataTypes.DECIMAL,
    poster_path: DataTypes.STRING,
    release_date: DataTypes.DATEONLY,
    video: DataTypes.STRING,
    vote_average: DataTypes.DECIMAL,
    vote_count: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};