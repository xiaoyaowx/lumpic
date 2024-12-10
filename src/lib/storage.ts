import fs from 'fs/promises';
import path from 'path';
import { format } from 'date-fns';

// 基础目录配置
const BASE_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const BASE_THUMBNAIL_DIR = path.join(process.cwd(), 'public', 'thumbnails');

/**
 * 获取当前日期的目录路径
 * 格式: uploads/YYYY/MM/DD
 */
function getDateBasedDir(baseDir: string, date: Date = new Date()): string {
  const year = format(date, 'yyyy');
  const month = format(date, 'MM');
  const day = format(date, 'dd');
  return path.join(baseDir, year, month, day);
}

/**
 * 从URL中获取文件路径
 * 例如: /uploads/2024/12/10/image.jpg -> /Users/xxx/project/public/uploads/2024/12/10/image.jpg
 */
function getFilePathFromUrl(url: string): string {
  // 移除开头的斜杠（如果存在）
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  // 直接拼接到 public 目录
  return path.join(process.cwd(), 'public', cleanUrl);
}

/**
 * 确保目录存在
 */
async function ensureDir(dir: string): Promise<void> {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

/**
 * 删除图片文件
 * @param url 图片的URL地址（例如：/uploads/2024/12/10/image.jpg）
 * @param silent 如果为true，文件不存在时不会抛出错误
 */
export async function deleteImage(url: string, silent: boolean = true): Promise<void> {
  if (!url) {
    console.warn('Attempted to delete image with empty URL');
    return;
  }

  try {
    const filePath = getFilePathFromUrl(url);
    console.log('Deleting file:', filePath);
    
    // 检查文件是否存在
    try {
      await fs.access(filePath);
    } catch (error) {
      console.warn(`File not found: ${filePath}`);
      if (!silent) {
        throw new Error('File not found');
      }
      return;
    }

    // 删除文件
    await fs.unlink(filePath);
    console.log(`Successfully deleted file: ${filePath}`);

    // 尝试递归删除空目录
    try {
      let dirPath = path.dirname(filePath);
      while (dirPath !== path.join(process.cwd(), 'public')) {
        const files = await fs.readdir(dirPath);
        if (files.length === 0) {
          await fs.rmdir(dirPath);
          console.log(`Removed empty directory: ${dirPath}`);
          dirPath = path.dirname(dirPath);
        } else {
          break;
        }
      }
    } catch (error) {
      console.warn('Failed to remove empty directories:', error);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    if (!silent) {
      throw new Error('Failed to delete image file');
    }
  }
}

/**
 * 生成基于日期的文件路径
 * @param originalName 原始文件名
 * @param type 'image' | 'thumbnail'
 * @returns {object} 包含URL和文件系统路径的对象
 */
export async function generateDateBasedPath(
  originalName: string,
  type: 'image' | 'thumbnail' = 'image'
): Promise<{ url: string; filePath: string }> {
  const baseDir = type === 'image' ? BASE_UPLOAD_DIR : BASE_THUMBNAIL_DIR;
  const date = new Date();
  const dateDir = getDateBasedDir(baseDir, date);
  
  // 确保目录存在
  await ensureDir(dateDir);
  
  // 生成唯一文件名
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(originalName);
  const filename = `${timestamp}-${randomStr}${ext}`;
  
  // 生成完整路径
  const filePath = path.join(dateDir, filename);
  
  // 生成URL（从public目录开始的相对路径）
  const relativeDir = type === 'image' ? 'uploads' : 'thumbnails';
  const url = `/${relativeDir}/${format(date, 'yyyy/MM/dd')}/${filename}`;
  
  return { url, filePath };
}
