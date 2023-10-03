// @ts-nocheck
import { Model, DataTypes } from 'sequelize';
import connection from '../db/connection.js';
class Thumbnail extends Model {
}
Thumbnail.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    url: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    alt: {
        type: DataTypes.STRING(512),
        allowNull: false,
        unique: false,
    },
    width: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize: connection,
    timestamps: true,
});
export default Thumbnail;
