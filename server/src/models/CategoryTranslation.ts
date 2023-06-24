import { Model, DataTypes } from 'sequelize';
import connection from '../db/connection.js';
import Category from './Category.js';
import Language from './Language.js';

class CategoryTranslation extends Model {}

CategoryTranslation.init(
  {
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
  },
  {
    sequelize: connection, // Assuming you have an existing Sequelize instance named 'sequelize'
    timestamps: true,
  }
);

Category.hasMany(CategoryTranslation, {
  as: 'localization',
  foreignKey: 'categoryId',
  onDelete: 'CASCADE',
});
CategoryTranslation.belongsTo(Category, {
  as: 'category',
  foreignKey: 'categoryId',
});
CategoryTranslation.belongsTo(Language, {
  foreignKey: 'languageId',
  as: 'language',
});

export default CategoryTranslation;
