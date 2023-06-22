import { Model, DataTypes } from 'sequelize';
import connection from '../db/connection.js';
import CategoryTranslation from './CategoryTranslation.js';
import Article from './Article.js'

class Category extends Model { };

Category.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(64),
        validate: {
            len: [2, 64],
        },
        unique: true,
    },
    
}, {
    sequelize: connection, // Assuming you have an existing Sequelize instance named 'sequelize'
    timestamps: true,
});

export default Category;