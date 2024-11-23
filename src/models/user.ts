import { Database } from 'sqlite';
import bcrypt from 'bcrypt';
import { User, UserUpdateRequest, ContainerConfig } from '@/types';

/**
 * 用户模型类
 */
export class UserModel {
  constructor(private db: Database) {}

  /**
   * 根据用户名查找用户
   * @param username - 用户名
   */
  async findByUsername(username: string): Promise<User | undefined> {
    const sql = 'SELECT * FROM users WHERE username = ?';
    return this.db.get<User>(sql, [username]);
  }

  /**
   * 创建新用户
   * @param username - 用户名
   * @param password - 密码
   * @param avatar - 头像URL（可选）
   */
  async create(username: string, password: string, avatar?: string): Promise<User> {
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS) || 10);

    const sql = `
      INSERT INTO users (username, password, avatar)
      VALUES (?, ?, ?)
      RETURNING *
    `;

    const user = await this.db.get<User>(sql, [username, hashedPassword, avatar]);
    if (!user) {
      throw new Error('Failed to create user');
    }
    return user;
  }

  /**
   * 验证用户密码
   * @param password - 明文密码
   * @param hashedPassword - 加密后的密码
   */
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * 更新用户信息
   * @param userId - 用户ID
   * @param data - 更新数据
   */
  async update(userId: number, data: UserUpdateRequest): Promise<User> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.avatar !== undefined) {
      updates.push('avatar = ?');
      values.push(data.avatar);
    }

    if (data.weather_adcode !== undefined) {
      updates.push('weather_adcode = ?');
      values.push(data.weather_adcode);
    }

    if (data.weather_key !== undefined) {
      updates.push('weather_key = ?');
      values.push(data.weather_key);
    }

    if (data.container_config !== undefined) {
      updates.push('container_config = ?');
      values.push(JSON.stringify(data.container_config));
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    const sql = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = ?
      RETURNING *
    `;

    const user = await this.db.get<User>(sql, values);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * 获取用户信息
   * @param userId - 用户ID
   */
  async findById(userId: number): Promise<User | undefined> {
    const sql = 'SELECT * FROM users WHERE id = ?';
    return this.db.get<User>(sql, [userId]);
  }
} 