import { Model, DataTypes } from 'sequelize';
import connection from '../db/connection.js';
import User from './User.js';
import Category from './Category.js';
// import Domain from './Domain.js';

class Article extends Model { };

Article.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    thumbnail: {
        type: DataTypes.STRING,
    },
    pub_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize: connection,
    timestamps: true,
});

Article.belongsTo(User, { as: 'author' });
Article.belongsTo(Category);
// Article.hasMany(Domain);

export default Article;