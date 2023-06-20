import { Model, DataTypes } from 'sequelize';
import connection from '../db/connection.js';

class APIToken extends Model {};

APIToken.init({
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  token: {
    type: DataTypes.STRING(2048),
    allowNull: false,
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING(32),
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [2, 32],
        msg: 'Name must be between 2 and 32 characters long.',
      },
    },
  },
  description: {
    type: DataTypes.STRING(512),
    allowNull: true,
  },
  accessRights: {
    type: DataTypes.ENUM('readOnly', 'fullAccess'),
    allowNull: false,
  }
}, {
  sequelize: connection, // Assuming you have an existing Sequelize instance named 'sequelize'
  timestamps: true,
});

export default APIToken;