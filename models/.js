'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }.init({
    tmdb_id: DataTypes.STRING,
    facebook_id: DataTypes.STRING,
    instagram_id: DataTypes.STRING,
    twitter_id: DataTypes.STRING,
    popularity: DataTypes.DECIMAL,
    poster_path: DataTypes.STRING,
    release_date: DataTypes.DATEONLY,
    title: DataTypes.STRING,
    video: DataTypes.STRING,
    vote_average: DataTypes.DECIMAL,
    vote_count: DataTypes.DECIMAL,
    id_genre: DataTypes.INTEGER,
    id_actor: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: '',
  });
  return;
};