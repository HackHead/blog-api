import { Model, DataTypes } from 'sequelize';
import connection from '../db/connection.js';

class Domain extends Model {}

Domain.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ip_address: {
      type: DataTypes.STRING,
      validate: {
        isIP: true,
      },
    },
    url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
  },
  {
    sequelize: connection, 
    timestamps: true,
  }
);

export default Domain;
