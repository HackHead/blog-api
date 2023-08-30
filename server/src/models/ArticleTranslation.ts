import { Model, DataTypes } from 'sequelize';
import connection from '../db/connection.js';
import Language from './Language.js';

class ArticleTranslation extends Model {}

ArticleTranslation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    author_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pub_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
    body: {
      type: DataTypes.STRING(65536),
      allowNull: true,
    },
    excerpt: {
      type: DataTypes.STRING(16384),
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING(16384),
      allowNull: true,
    },
  },
  {
    sequelize: connection,
    timestamps: true,
  }
);

ArticleTranslation.belongsTo(Language, {
  foreignKey: 'languageId',
  as: 'language',
});

Language.hasMany(ArticleTranslation, {
  foreignKey: 'languageId',
  as: 'language',
});

export default ArticleTranslation;
