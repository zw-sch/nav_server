import { Database } from 'sqlite';
import { initDatabase } from '../config/database';

async function update() {
  try {
    const db = await initDatabase();

    // 创建系统配置表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS system_configs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        site_title TEXT DEFAULT 'Home Nav',
        icp_record TEXT,
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