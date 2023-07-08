  // @ts-nocheck
  import { Model, DataTypes } from 'sequelize';
  import connection from '../db/connection.js';
  import Category from './Category.js';
  import ArticleTranslation from './ArticleTranslation.js';
  import Domain from './Domain.js';
  import Thumbnail from './Thumbnail.js';

  class Article extends Model {}

  Article.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
    }
  );


  Article.belongsTo(Thumbnail, {
    foreignKey: 'thumbnailId',
    allowNull: true,
    as: 'thumbnail', 
  });
  

  Article.belongsTo(Domain, {
    foreignKey: 'domainId',
    allowNull: true,
    as: 'domain', 
  });

  Article.hasMany(ArticleTranslation, {
    as: 'localization',
    foreignKey: {
      name: 'articleId',
      allowNull: true
    },
    onDelete: 'CASCADE',
  });

  ArticleTranslation.belongsTo(Article, {
    foreignKey: {
      name: 'articleId',
    },
    as: 'localization',
  });

  Category.hasMany(Article, {
    foreignKey: 'categoryId',
    allowNull: false,
    as: 'articles', 
  });

  Article.belongsTo(Category, {
    foreignKey: 'categoryId',
    allowNull: false,
    as: 'category', 
  });

  export default Article;
