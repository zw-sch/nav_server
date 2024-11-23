import { Database } from 'sqlite';

interface HotSourceData {
  name: string;
  url: string;
  icon: string;
  type: string;
  enable_preview?: boolean;
  sort_order?: number;
}

/**
 * 热搜源模型类
 */
export class HotSourceModel {
  constructor(private db: Database) {}

  /**
   * 获取用户的所有热搜源
   */
  async findByUserId(userId: number) {
    const sql = `
      SELECT * FROM hot_sources 
      WHERE user_id = ? 
      ORDER BY sort_order ASC, created_at DESC
    `;
    return this.db.all(sql, [userId.toString()]);
  }

  /**
   * 创建新热搜源
   */
  async create(data: HotSourceData, userId: number) {
    const sql = `
      INSERT INTO hot_sources (
        name, url, icon, type, enable_preview, user_id, sort_order
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `;
    const source = await this.db.get(sql, [
      data.name,
      data.url,
      data.icon,
      data.type,
      data.enable_preview ? '1' : '0',
      userId.toString(),
      (data.sort_order || 0).toString()
    ]);

    if (!source) {
      throw new Error('Failed to create hot source');
    }
    return source;
  }

  /**
   * 更新热搜源
   */
  async update(id: number, data: Partial<HotSourceData>, userId: number) {
    const updates: string[] = [];
    const values: string[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.url !== undefined) {
      updates.push('url = ?');
      values.push(data.url);
    }
    if (data.icon !== undefined) {
      updates.push('icon = ?');
      values.push(data.icon);
    }
    if (data.type !== undefined) {
      updates.push('type = ?');
      values.push(data.type);
    }
    if (data.enable_preview !== undefined) {
      updates.push('enable_preview = ?');
      values.push(data.enable_preview ? '1' : '0');
    }
    if (data.sort_order !== undefined) {
      updates.push('sort_order = ?');
      values.push(data.sort_order.toString());
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id.toString());
    values.push(userId.toString());

    const sql = `
      UPDATE hot_sources
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
      RETURNING *
    `;

    const source = await this.db.get(sql, values);
    if (!source) {
      throw new Error('Hot source not found or unauthorized');
    }
    return source;
  }

  /**
   * 删除热搜源
   */
  async delete(id: number, userId: number) {
    const result = await this.db.run(
      'DELETE FROM hot_sources WHERE id = ? AND user_id = ?',
      [id.toString(), userId.toString()]
    );
    if (result.changes === 0) {
      throw new Error('Hot source not found or unauthorized');
    }
  }
} 