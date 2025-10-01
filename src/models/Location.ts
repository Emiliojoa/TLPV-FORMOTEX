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
  tableName: 'locations',
  timestamps: true,
})
export class Location extends Model<Location> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  building!: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  floor!: number;

  @Column(DataType.STRING(50))
  room?: string;

  @Column(DataType.STRING(200))
  address?: string;

  @Column(DataType.TEXT)
  description?: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at!: Date;

  // Associations
  @HasMany(() => Equipment, 'location_id')
  equipment!: Equipment[];

  // Instance methods
  getFullLocation(): string {
    const roomStr = this.room ? `, Room ${this.room}` : '';
    return `${this.name} - ${this.building}, Floor ${this.floor}${roomStr}`;
  }

  async getEquipmentCount(): Promise<number> {
    return await Equipment.count({ where: { location_id: this.id } });
  }
}
