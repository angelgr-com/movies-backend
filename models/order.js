'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'id_user'
      });
      this.belongsTo(models.Movie, {
          foreignKey: 'id_movie'
      });
    }
  }
  Order.init({
    rent_date: DataTypes.DATEONLY,
    return_date: DataTypes.DATEONLY,
    id_user: DataTypes.UUID,
    id_movie: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};