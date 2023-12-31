import { Model, DataTypes } from 'sequelize';
import connection from '../db/connection.js';
class Language extends Model {
}
Language.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 8],
        },
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 64],
        },
    },
}, {
    sequelize: connection,
    timestamps: true,
});
export default Language;
