'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Copy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Order, {
        foreignKey: 'id_order'
      });
      this.belongsTo(models.Movie, {
        foreignKey: 'id_movie'
      });
    }
  }
  Copy.init({
    id_order: DataTypes.INTEGER,
    id_movie: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Copy',
  });
  return Copy;
};