import { Database } from 'sqlite';

interface BookmarkData {
  name: string;
  categoryId: number;
  internalUrl?: string;
  externalUrl?: string;
  icon?: string;
  remark?: string;
  sort_order?: number;
}

/**
 * 书签模型类
 */
export class BookmarkModel {
  constructor(private db: Database) {}

  /**
   * 获取用户的所有书签
   */
  async findByUserId(userId: number) {
    const sql = `
      SELECT * FROM bookmarks 
      WHERE user_id = ? 
      ORDER BY sort_order ASC, created_at DESC
    `;
    return this.db.all(sql, [userId.toString()]);
  }

  /**
   * 创建新书签
   */
  async create(data: BookmarkData, userId: number) {
    const sql = `
      INSERT INTO bookmarks (
        name, category_id, internal_url, external_url, 
        icon, remark, user_id, sort_order
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `;
    const bookmark = await this.db.get(sql, [
      data.name,
      data.categoryId.toString(),
      data.internalUrl || '',
      data.externalUrl || '',
      data.icon || '',
      data.remark || '',
      userId.toString(),
      (data.sort_order || 0).toString()
    ]);

    if (!bookmark) {
      throw new Error('Failed to create bookmark');
    }
    return bookmark;
  }

  /**
   * 更新书签
   */
  async update(id: number, data: Partial<BookmarkData>, userId: number) {
    const updates: string[] = [];
    const values: string[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.categoryId !== undefined) {
      updates.push('category_id = ?');
      values.push(data.categoryId.toString());
    }
    if (data.internalUrl !== undefined) {
      updates.push('internal_url = ?');
      values.push(data.internalUrl);
    }
    if (data.externalUrl !== undefined) {
      updates.push('external_url = ?');
      values.push(data.externalUrl);
    }
    if (data.icon !== undefined) {
      updates.push('icon = ?');
      values.push(data.icon);
    }
    if (data.remark !== undefined) {
      updates.push('remark = ?');
      values.push(data.remark);
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
      UPDATE bookmarks
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
      RETURNING *
    `;

    const bookmark = await this.db.get(sql, values);
    if (!bookmark) {
      throw new Error('Bookmark not found or unauthorized');
    }
    return bookmark;
  }

  /**
   * 根据分类ID查找书签
   */
  async findByCategoryId(categoryId: number, userId: number) {
    const sql = `
      SELECT * FROM bookmarks 
      WHERE category_id = ? AND user_id = ?
      ORDER BY sort_order ASC, created_at DESC
    `;
    return this.db.all(sql, [categoryId.toString(), userId.toString()]);
  }

  /**
   * 删除书签
   */
  async delete(id: number, userId: number) {
    const result = await this.db.run(
      'DELETE FROM bookmarks WHERE id = ? AND user_id = ?',
      [id.toString(), userId.toString()]
    );
    if (result.changes === 0) {
      throw new Error('Bookmark not found or unauthorized');
    }
  }
} 