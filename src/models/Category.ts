import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  HasMany,
  Unique,
} from 'sequelize-typescript';
import { Equipment } from './Equipment';

@Table({
  tableName: 'categories',
  timestamps: true,
})
export class Category extends Model<Category> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column(DataType.STRING(7))
  color_code?: string; // Hex color for UI display

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at!: Date;

  // Associations
  @HasMany(() => Equipment, 'category_id')
  equipment!: Equipment[];

  // Instance methods
  async getEquipmentCount(): Promise<number> {
    return await Equipment.count({ where: { category_id: this.id } });
  }
}
