// @ts-nocheck
import { Model, DataTypes } from 'sequelize';
import connection from '../db/connection.js';
import User from './User.js';
import Category from './Category.js';
import ArticleTranslation from './ArticleTranslation.js';

class Article extends Model {}

Article.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    thumbnail: {
      type: DataTypes.STRING,
    },

    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: connection,
    timestamps: true,
    hooks: {
      afterFind: function (result, options) {
        result.forEach((item) => {
          item.mambo = 'pizda';
        });
        return result;
      },
    },
  }
);

Article.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });
Article.hasMany(ArticleTranslation, {
  as: 'localization',
  foreignKey: 'articleId',
});

export default Article;
