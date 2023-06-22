import { Model, DataTypes } from 'sequelize';
import connection from '../db/connection.js';
import Language from './Language.js';

class ArticleTranslation extends Model { };

ArticleTranslation.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pub_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    body: {
        type: DataTypes.STRING(65536),
    },
    excerpt: {
        type: DataTypes.STRING(512),
    },
    slug: {
        type: DataTypes.STRING(512),
    },
}, {
    sequelize: connection, // Assuming you have an existing Sequelize instance named 'sequelize'
    timestamps: true,
});

ArticleTranslation.belongsTo(Language, {foreignKey: 'languageId', as: 'language'});

export default ArticleTranslation;