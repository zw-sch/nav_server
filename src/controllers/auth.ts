import { Request, Response } from 'express';
import { UserModel } from '@/models/user';
import { generateToken } from '@/utils/jwt';
import { Database } from 'sqlite';
import { User, UserUpdateRequest, ContainerConfig } from '@/types';

let userModel: UserModel;

export function initAuthController(db: Database) {
  userModel = new UserModel(db);
}

/**
 * 用户注册控制器
 */
export async function register(req: Request, res: Response) {
  try {
    const { username, password, avatar } = req.body;

    // 验证用户名和密码
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: 'Username and password are required'
      });
    }

    // 检查用户名是否已存在
    const existingUser = await userModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: 'Username already exists'
      });
    }

    // 创建新用户
    const user = await userModel.create(username, password, avatar);

    // 生成 token
    const token = generateToken({
      id: user.id,
      username: user.username
    });

    // 返回用户信息和token
    res.json({
      code: 200,
      message: 'Register success',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
}

/**
 * 用户登录控制器
 */
export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    // 验证用户名和密码
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: 'Username and password are required'
      });
    }

    // 查找用户
    const user = await userModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户名不存在'
      });
    }

    // 验证密码
    const isValid = await userModel.verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        code: 401,
        message: '用户密码错误'
      });
    }

    // 生成 token
    const token = generateToken({
      id: user.id,
      username: user.username
    });

    // 解析容器配置
    let containerConfig: ContainerConfig;
    try {
      containerConfig = user.container_config ? JSON.parse(user.container_config) : {
        showWeather: true,
        showHotSearch: true,
        showBookmark: true
      };
    } catch (e) {
      containerConfig = {
        showWeather: true,
        showHotSearch: true,
        showBookmark: true
      };
    }

    // 处理天气 key 的显示
    let maskedWeatherKey = user.weather_key;
    if (maskedWeatherKey && maskedWeatherKey.length > 12) {
      const prefix = maskedWeatherKey.slice(0, 6);
      const suffix = maskedWeatherKey.slice(-6);
      const maskLength = maskedWeatherKey.length - 12;
      maskedWeatherKey = prefix + '*'.repeat(maskLength) + suffix;
    }

    // 返回用户信息和token
    res.json({
      code: 200,
      message: 'Login success',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          weather_adcode: user.weather_adcode,
          weather_key: maskedWeatherKey,
          container_config: containerConfig
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
}

/**
 * 获取用户信息
 */
export async function getUserInfo(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: 'User not found'
      });
    }

    // 解析容器配置
    let containerConfig: ContainerConfig;
    try {
      containerConfig = user.container_config ? JSON.parse(user.container_config) : {
        showWeather: true,
        showHotSearch: true,
        showBookmark: true
      };
    } catch (e) {
      containerConfig = {
        showWeather: true,
        showHotSearch: true,
        showBookmark: true
      };
    }

    // 处理天气 key 的显示
    let maskedWeatherKey = user.weather_key;
    if (maskedWeatherKey && maskedWeatherKey.length > 12) {
      const prefix = maskedWeatherKey.slice(0, 6);
      const suffix = maskedWeatherKey.slice(-6);
      const maskLength = maskedWeatherKey.length - 12;
      maskedWeatherKey = prefix + '*'.repeat(maskLength) + suffix;
    }

    res.json({
      code: 200,
      message: 'Success',
      data: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        weather_adcode: user.weather_adcode,
        weather_key: maskedWeatherKey,
        container_config: containerConfig
      }
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
}

/**
 * 更新用户信息
 */
export async function updateUserInfo(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const updateData: UserUpdateRequest = req.body;

    const user = await userModel.update(userId, updateData);

    // 解析容器配置
    let containerConfig: ContainerConfig;
    try {
      containerConfig = user.container_config ? JSON.parse(user.container_config) : {
        showWeather: true,
        showHotSearch: true,
        showBookmark: true
      };
    } catch (e) {
      containerConfig = {
        showWeather: true,
        showHotSearch: true,
        showBookmark: true
      };
    }

    // 处理天气 key 的显示
    let maskedWeatherKey = user.weather_key;
    if (maskedWeatherKey && maskedWeatherKey.length > 12) {
      const prefix = maskedWeatherKey.slice(0, 6);
      const suffix = maskedWeatherKey.slice(-6);
      const maskLength = maskedWeatherKey.length - 12;
      maskedWeatherKey = prefix + '*'.repeat(maskLength) + suffix;
    }

    res.json({
      code: 200,
      message: 'User info updated successfully',
      data: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        weather_adcode: user.weather_adcode,
        weather_key: maskedWeatherKey,
        container_config: containerConfig
      }
    });
  } catch (error) {
    console.error('Update user info error:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
} 