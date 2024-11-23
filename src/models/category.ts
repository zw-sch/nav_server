import { Database } from 'sqlite';

interface CategoryData {
  sort_order?: number;
  [key: string]: any;
}

/**
 * 书签分类模型类
 */
export class CategoryModel {
  constructor(private db: Database) {}

  /**
   * 获取用户的所有分类
   */
  async findByUserId(userId: number) {
    const sql = 'SELECT * FROM bookmark_categories WHERE user_id = ? ORDER BY sort_order ASC, created_at DESC';
    return this.db.all(sql, [userId.toString()]);
  }

  /**
   * 创建新分类
   */
  async create(name: string, userId: number, icon?: string, data: CategoryData = {}) {
    const sql = `
      INSERT INTO bookmark_categories (name, user_id, icon, sort_order)
      VALUES (?, ?, ?, ?)
      RETURNING *
    `;
    const category = await this.db.get(sql, [
      name, 
      userId.toString(), 
      icon, 
      (data.sort_order || 0).toString()
    ]);
    
    if (!category) {
      throw new Error('Failed to create category');
    }
    return category;
  }

  /**
   * 更新分类
   */
  async update(id: number, name: string, icon: string | null, userId: number, data: CategoryData = {}) {
    const updates = ['name = ?', 'icon = ?'];
    const values: string[] = [name, icon || ''];

    if (data.sort_order !== undefined) {
      updates.push('sort_order = ?');
      values.push(data.sort_order.toString());
    }

    values.push(id.toString());
    if (userId) values.push(userId.toString());

    const sql = `
      UPDATE bookmark_categories
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? ${userId ? 'AND user_id = ?' : ''}
      RETURNING *
    `;

    const category = await this.db.get(sql, values);
    if (!category) {
      throw new Error('Category not found or unauthorized');
    }
    return category;
  }

  /**
   * 删除分类
   */
  async delete(id: number, userId: number) {
    const result = await this.db.run(
      'DELETE FROM bookmark_categories WHERE id = ? AND user_id = ?',
      [id.toString(), userId.toString()]
    );
    if (result.changes === 0) {
      throw new Error('Category not found or unauthorized');
    }
  }
} 