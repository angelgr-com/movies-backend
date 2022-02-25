'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tmdb_id: {
        type: Sequelize.STRING
      },
      facebook_id: {
        type: Sequelize.STRING
      },
      instagram_id: {
        type: Sequelize.STRING
      },
      twitter_id: {
        type: Sequelize.STRING
      },
      popularity: {
        type: Sequelize.DECIMAL
      },
      poster_path: {
        type: Sequelize.STRING
      },
      release_date: {
        type: Sequelize.DATEONLY
      },
      title: {
        type: Sequelize.STRING
      },
      video: {
        type: Sequelize.STRING
      },
      vote_average: {
        type: Sequelize.DECIMAL
      },
      vote_count: {
        type: Sequelize.DECIMAL
      },
      id_genre: {
        type: Sequelize.INTEGER
      },
      id_actor: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Movies');
  }
};