import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';

/**
 * 认证中间件
 * 验证请求头中的 Authorization token
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // 获取 Authorization 头
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        code: 401,
        message: 'No token provided'
      });
    }

    // 提取 token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: 'Invalid token format'
      });
    }

    // 验证 token
    const decoded = verifyToken(token);
    
    // 将用户信息添加到请求对象
    req.user = {
      id: decoded.id,
      username: decoded.username
    };

    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: 'Invalid token'
    });
  }
} 