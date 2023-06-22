const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('CategoryTranslations', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      languageId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Languages',
          key: 'id',
        },
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id',
        },
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
    await queryInterface.removeConstraint('CategoryTranslations', 'unique_name_per_category');
    await queryInterface.dropTable('CategoryTranslations');
  },
};
