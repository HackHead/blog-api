const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('ArticleTranslations', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.STRING(65536),
        allowNull: true,
      },
      excerpt: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },
      languageId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Languages',
          key: 'id',
        },
      },
      articleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Articles',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      pub_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
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
    await queryInterface.dropTable('ArticleTranslations');
  },
};

// module.exports = {
//   up: async (queryInterface) => {
//     await Promise.resolve()
//   },

//   down: async (queryInterface) => {
//     await Promise.resolve()
//   },
// };