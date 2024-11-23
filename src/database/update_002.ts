import { Database } from 'sqlite';
import { initDatabase } from '../config/database';

async function update() {
  try {
    const db = await initDatabase();

    // 创建热搜源表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS hot_sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        icon TEXT NOT NULL,
        type TEXT NOT NULL,
        enable_preview BOOLEAN DEFAULT 0,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    console.log('Database update completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database update failed:', error);
    process.exit(1);
  }
}

update(); 