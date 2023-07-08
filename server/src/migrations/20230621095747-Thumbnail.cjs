'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Thumbnails', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      url: {
        allowNull: true,
        unique: true,
        type: Sequelize.STRING,
      },
      alt: {
        allowNull: false,
        type: Sequelize.STRING(512),
      },
      width: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      height: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Thumbnails');
  },
};
