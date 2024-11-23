import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import path from 'path';
import fs from 'fs';

// 数据库连接实例
let db: Database;

/**
 * 初始化数据库连接
 */
export async function initDatabase() {
  try {
    // 确保数据库目录存在
    const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/nav.db');
    const dbDir = path.dirname(dbPath);
    
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // 打开数据库连接
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('Database connected successfully');
    return db;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

/**
 * 获取数据库实例
 */
export function getDatabase(): Database {
  if (!db) {
    throw new Error('Please wait for database initialization');
  }
  return db;
}

/**
 * 设置数据库实例
 */
export function setDatabase(database: Database) {
  db = database;
} 