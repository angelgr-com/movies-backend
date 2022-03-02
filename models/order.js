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
    is_paid: DataTypes.BOOLEAN,
    id_user: DataTypes.INTEGER,
    id_movie: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};