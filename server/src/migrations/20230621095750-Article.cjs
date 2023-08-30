const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('Articles', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      authorId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      domainId: {
        type: DataTypes.UUID,
        allowNull: true, 
        references: {
          model: 'Domains',
          key: 'id',
        },
        onDelete: 'SET NULL'
      },
      categoryId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      thumbnailId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: 'Thumbnails',
          key: 'id',
        },
        onDelete: 'SET NULL'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Articles');
  },
};