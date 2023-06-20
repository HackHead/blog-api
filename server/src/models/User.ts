import { Model, DataTypes } from 'sequelize';
import connection from '../db/connection.js';

class User extends Model { };

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 64],
        },
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 64],
        },
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [4, 128],
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING(4096),
        allowNull: false,
    }
}, {
    sequelize: connection, // Assuming you have an existing Sequelize instance named 'sequelize'
    timestamps: true,
});

export default User;