'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MovieGenres', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_movie: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Movies',
            key: 'id'
        }
      },
      id_genre: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Genres',
            key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MovieGenres');
  }
};