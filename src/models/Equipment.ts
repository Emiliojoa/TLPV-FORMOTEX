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
  Default,
  BelongsTo,
  ForeignKey,
  Unique,
} from 'sequelize-typescript';
import { User } from './User';
import { Category } from './Category';
import { Location } from './Location';

export enum EquipmentType {
  LAPTOP = 'laptop',
  DESKTOP = 'desktop',
  MONITOR = 'monitor',
  PRINTER = 'printer',
  TABLET = 'tablet',
  PHONE = 'phone',
  SERVER = 'server',
  ROUTER = 'router',
  SWITCH = 'switch',
  SCANNER = 'scanner',
  PROJECTOR = 'projector',
  UPS = 'ups',
  KEYBOARD = 'keyboard',
  MOUSE = 'mouse',
  WEBCAM = 'webcam',
  HEADSET = 'headset',
  OTHER = 'other'
}

export enum EquipmentStatus {
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  IN_MAINTENANCE = 'in_maintenance',
  RETIRED = 'retired',
  LOST = 'lost',
  DAMAGED = 'damaged'
}

export enum EquipmentCondition {
  NEW = 'new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  DAMAGED = 'damaged'
}

@Table({
  tableName: 'equipment',
  timestamps: true,
})
export class Equipment extends Model<Equipment> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  brand!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  model!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  serial_number!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(EquipmentType)))
  equipment_type!: EquipmentType;

  @AllowNull(false)
  @Default(EquipmentStatus.AVAILABLE)
  @Column(DataType.ENUM(...Object.values(EquipmentStatus)))
  status!: EquipmentStatus;

  @AllowNull(false)
  @Default(EquipmentCondition.NEW)
  @Column(DataType.ENUM(...Object.values(EquipmentCondition)))
  condition!: EquipmentCondition;

  @AllowNull(false)
  @Column(DataType.DATE)
  purchase_date!: Date;

  @Column(DataType.DATE)
  warranty_end_date?: Date;

  @Column(DataType.DECIMAL(10, 2))
  purchase_price?: number;

  @Column(DataType.TEXT)
  specifications?: string;

  @Column(DataType.TEXT)
  notes?: string;

  // Foreign Keys
  @ForeignKey(() => Location)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  location_id!: number;

  @ForeignKey(() => Category)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  category_id!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  assigned_user_id?: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at!: Date;

  // Associations
  @BelongsTo(() => User, 'assigned_user_id')
  assigned_user?: User;

  @BelongsTo(() => Category, 'category_id')
  category!: Category;

  @BelongsTo(() => Location, 'location_id')
  location!: Location;

  // Instance methods
  isAvailable(): boolean {
    return this.status === EquipmentStatus.AVAILABLE;
  }

  isAssigned(): boolean {
    return this.status === EquipmentStatus.ASSIGNED;
  }

  isUnderWarranty(): boolean {
    if (!this.warranty_end_date) return false;
    return new Date() <= this.warranty_end_date;
  }

  getEquipmentInfo(): string {
    return `${this.brand} ${this.model} (${this.serial_number})`;
  }

  // Assign equipment to user
  async assignTo(userId: number): Promise<void> {
    this.assigned_user_id = userId;
    this.status = EquipmentStatus.ASSIGNED;
    await this.save();
  }

  // Unassign equipment
  async unassign(): Promise<void> {
    this.assigned_user_id = undefined;
    this.status = EquipmentStatus.AVAILABLE;
    await this.save();
  }
}
