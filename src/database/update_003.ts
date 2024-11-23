import { Database } from 'sqlite';
import { initDatabase } from '../config/database';

async function update() {
  try {
    const db = await initDatabase();

    // 修改 bookmarks 表
    await db.exec(`
      PRAGMA foreign_keys=off;

      BEGIN TRANSACTION;

      -- 创建临时表
      CREATE TABLE bookmarks_temp (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        icon TEXT,
        remark TEXT,
        internal_url TEXT,
        external_url TEXT,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES bookmark_categories(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- 复制数据
      INSERT INTO bookmarks_temp(id, name, category_id, icon, remark, internal_url, external_url, user_id, created_at, updated_at)
      SELECT id, name, category_id, icon, remark, internal_url, external_url, user_id, created_at, updated_at
      FROM bookmarks;

      -- 删除旧表
      DROP TABLE bookmarks;

      -- 重命名新表
      ALTER TABLE bookmarks_temp RENAME TO bookmarks;

      COMMIT;

      PRAGMA foreign_keys=on;
    `);

    console.log('Database update completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database update failed:', error);
    process.exit(1);
  }
}

update(); 