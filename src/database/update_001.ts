import { Database } from 'sqlite';
import { initDatabase } from '../config/database';

async function update() {
  try {
    const db = await initDatabase();

    // 添加新字段到 users 表
    await db.exec(`
      PRAGMA foreign_keys=off;

      BEGIN TRANSACTION;

      -- 创建临时表
      CREATE TABLE users_temp (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        avatar TEXT,
        weather_adcode TEXT,
        weather_key TEXT,
        container_config TEXT DEFAULT '{"showWeather":true,"showHotSearch":true,"showBookmark":true}',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- 复制数据
      INSERT INTO users_temp(id, username, password, avatar, created_at, updated_at)
      SELECT id, username, password, avatar, created_at, updated_at
      FROM users;

      -- 删除旧表
      DROP TABLE users;

      -- 重命名新表
      ALTER TABLE users_temp RENAME TO users;

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