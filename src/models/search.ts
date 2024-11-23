import { Database } from 'sqlite';
import { SearchEngine } from '@/types';

/**
 * 搜索引擎模型类
 */
export class SearchEngineModel {
  constructor(private db: Database) {}

  /**
   * 获取用户的所有搜索引擎
   * @param userId - 用户ID
   */
  async findByUserId(userId: number): Promise<SearchEngine[]> {
    const sql = `
      SELECT * FROM search_engines 
      WHERE user_id = ? 
      ORDER BY sort_order ASC, created_at DESC
    `;
    return this.db.all<SearchEngine[]>(sql, [userId]);
  }

  /**
   * 根据快速命令查找搜索引擎
   * @param quickCommand - 快速命令
   * @param userId - 用户ID
   * @param excludeId - 排除的搜索引擎ID（用于更新时检查）
   */
  async findByQuickCommand(quickCommand: string, userId: number, excludeId?: number): Promise<SearchEngine | undefined> {
    const sql = `
      SELECT * FROM search_engines 
      WHERE LOWER(quick_command) = LOWER(?) AND user_id = ? ${excludeId ? 'AND id != ?' : ''}
    `;
    const params = excludeId ? [quickCommand, userId, excludeId] : [quickCommand, userId];
    return this.db.get<SearchEngine>(sql, params);
  }

  /**
   * 创建新搜索引擎
   * @param data - 搜索引擎数据
   * @param userId - 用户ID
   */
  async create(data: {
    name: string;
    url?: string;
    searchUrl: string;
    icon: string;
    sortOrder?: number;
    quickCommand?: string;
  }, userId: number): Promise<SearchEngine> {
    // 检查快速命令是否已存在（不区分大小写）
    if (data.quickCommand) {
      const existing = await this.findByQuickCommand(data.quickCommand, userId);
      if (existing) {
        throw new Error(`快速命令 "${data.quickCommand}" 已被分配给 "${existing.name}"`);
      }
    }

    const sql = `
      INSERT INTO search_engines (
        name, url, search_url, icon, sort_order, quick_command, user_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `;

    const engine = await this.db.get<SearchEngine>(sql, [
      data.name,
      data.url || null,
      data.searchUrl,
      data.icon,
      data.sortOrder || 0,
      data.quickCommand || null,
      userId
    ]);

    if (!engine) {
      throw new Error('Failed to create search engine');
    }
    return engine;
  }

  /**
   * 更新搜索引擎
   * @param id - 搜索引擎ID
   * @param data - 更新数据
   * @param userId - 用户ID
   */
  async update(id: number, data: {
    name?: string;
    url?: string;
    searchUrl?: string;
    icon?: string;
    sortOrder?: number;
    quickCommand?: string;
  }, userId: number): Promise<SearchEngine> {
    // 检查快速命令是否已存在（不区分大小写）
    if (data.quickCommand) {
      const existing = await this.findByQuickCommand(data.quickCommand, userId, id);
      if (existing) {
        throw new Error(`快速命令 "${data.quickCommand}" 已被分配给 "${existing.name}"`);
      }
    }

    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${this.toSnakeCase(key)} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    values.push(userId);

    const sql = `
      UPDATE search_engines
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
      RETURNING *
    `;

    const engine = await this.db.get<SearchEngine>(sql, values);
    if (!engine) {
      throw new Error('Search engine not found or unauthorized');
    }
    return engine;
  }

  /**
   * 删除搜索引擎
   * @param id - 搜索引擎ID
   * @param userId - 用户ID，用于验证权限
   */
  async delete(id: number, userId: number): Promise<void> {
    const result = await this.db.run(
      'DELETE FROM search_engines WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.changes === 0) {
      throw new Error('搜索引擎不存在或无权操作');
    }
  }

  private toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
} 