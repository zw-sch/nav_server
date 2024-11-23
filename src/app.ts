import 'module-alias/register'
import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import { initDatabase, setDatabase } from '@/config/database';
import { errorHandler } from '@/middleware/error';

import authRoutes from '@/routes/auth';
import bookmarkRoutes from '@/routes/bookmark';
import searchRoutes from '@/routes/search';
import hotRoutes from '@/routes/hot';
import weatherRoutes from '@/routes/weather';
import systemRoutes from '@/routes/system';
import { initAuthController } from '@/controllers/auth';
import { initBookmarkController } from '@/controllers/bookmark';
import { initSearchController } from '@/controllers/search';
import { initHotController } from '@/controllers/hot';
import { initWeatherController } from '@/controllers/weather';
import { initSystemController } from '@/controllers/system';

const app = express();

// 中间件
app.use(helmet());

// 配置 CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://10.0.0.173:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// 初始化数据库后再注册路由
async function setupRoutes() {
  const db = await initDatabase();
  setDatabase(db);

  // 初始化控制器
  initAuthController(db);
  initBookmarkController(db);
  initSearchController(db);
  initHotController(db);
  initWeatherController(db);
  initSystemController(db);

  // 路由
  app.use('/api/auth', authRoutes);
  app.use('/api/bookmarks', bookmarkRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/hot', hotRoutes);
  app.use('/api/weather', weatherRoutes);
  app.use('/api/system', systemRoutes);

  // 错误处理
  app.use(errorHandler as ErrorRequestHandler);
}

// 启动服务器
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await setupRoutes();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app; 