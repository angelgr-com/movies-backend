'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MovieGenre extends Model {
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
        this.belongsTo(models.Genre, {
            foreignKey: 'id_genre'
        });
    }
  }
  MovieGenre.init({
    id_movie: DataTypes.INTEGER,
    id_genre: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MovieGenre',
  });
  return MovieGenre;
};