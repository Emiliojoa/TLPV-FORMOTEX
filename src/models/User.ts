import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
  Default,
  HasMany,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import bcrypt from 'bcryptjs';
import { Equipment } from './Equipment';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(50))
  username!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  password!: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  first_name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  last_name!: string;

  @AllowNull(false)
  @Default(UserRole.USER)
  @Column(DataType.ENUM(...Object.values(UserRole)))
  role!: UserRole;

  @Column(DataType.STRING(100))
  department?: string;

  @Column(DataType.STRING(20))
  phone?: string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  is_active!: boolean;

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at!: Date;

  // Associations - equipos asignados al usuario
  @HasMany(() => Equipment, 'assigned_user_id')
  assigned_equipment!: Equipment[];

  // Password hashing hooks
  @BeforeCreate
  static async hashPasswordOnCreate(instance: User): Promise<void> {
    if (instance.password) {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      instance.password = await bcrypt.hash(instance.password, saltRounds);
    }
  }

  @BeforeUpdate
  static async hashPasswordOnUpdate(instance: User): Promise<void> {
    if (instance.changed('password') && instance.password) {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      instance.password = await bcrypt.hash(instance.password, saltRounds);
    }
  }

  // Instance methods
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  getFullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  // JSON serialization - exclude password
  toJSON(): object {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}
