import { DataTypes, Model } from "sequelize";
import sequelize from "./batabase";

class Usuario extends Model {
  public id!: number;
  public nombre!: string;
  public email!: string;
}

Usuario.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "usuarios", // nombre de la tabla en la base
  sequelize,
  timestamps: false, // si no quieres createdAt/updatedAt
});

export default Usuario;
