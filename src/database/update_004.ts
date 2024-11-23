import { Database } from 'sqlite';
import { initDatabase } from '../config/database';

async function update() {
  try {
    const db = await initDatabase();

    // 修改 search_engines 表
    await db.exec(`
      PRAGMA foreign_keys=off;

      BEGIN TRANSACTION;

      -- 创建临时表
      CREATE TABLE search_engines_temp (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT,
        search_url TEXT NOT NULL,
        icon TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        quick_command TEXT,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- 复制数据
      INSERT INTO search_engines_temp(id, name, url, search_url, icon, user_id, created_at, updated_at)
      SELECT id, name, url, search_url, icon, user_id, created_at, updated_at
      FROM search_engines;

      -- 删除旧表
      DROP TABLE search_engines;

      -- 重命名新表
      ALTER TABLE search_engines_temp RENAME TO search_engines;

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