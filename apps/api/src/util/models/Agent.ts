import { sequelize } from '../../service/sequelize';
import { DataTypes } from 'sequelize';

export const Agent = sequelize.define(
  'Agent',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);
