import { Request, Response, NextFunction } from 'express';

/**
 * 全局错误处理中间件
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  // 根据错误类型返回不同的状态码
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      code: 400,
      message: err.message
    });
  }

  // 默认返回500错误
  return res.status(500).json({
    code: 500,
    message: 'Internal server error'
  });
} 