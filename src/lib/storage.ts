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
 */
function getFilePathFromUrl(url: string): string {
  try {
    // 从URL中提取文件路径
    const urlPath = new URL(url, 'http://localhost').pathname;
    // 将URL路径转换为文件系统路径
    return path.join(process.cwd(), 'public', urlPath);
  } catch (error) {
    console.error('Invalid URL:', url);
    throw new Error('Invalid file URL');
  }
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
 * @param url 图片的URL地址
 * @param silent 如果为true，文件不存在时不会抛出错误
 */
export async function deleteImage(url: string, silent: boolean = true): Promise<void> {
  if (!url) {
    console.warn('Attempted to delete image with empty URL');
    return;
  }

  try {
    const filePath = getFilePathFromUrl(url);
    
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

    // 尝试删除空目录
    try {
      const dirPath = path.dirname(filePath);
      const files = await fs.readdir(dirPath);
      if (files.length === 0) {
        await fs.rmdir(dirPath);
        console.log(`Removed empty directory: ${dirPath}`);
      }
    } catch (error) {
      console.warn('Failed to remove empty directory:', error);
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
export async function generateDateBasedPath(originalName: string, type: 'image' | 'thumbnail' = 'image'): Promise<{
  url: string;
  filePath: string;
}> {
  const baseDir = type === 'image' ? BASE_UPLOAD_DIR : BASE_THUMBNAIL_DIR;
  const date = new Date();
  const dateDir = getDateBasedDir(baseDir, date);
  
  // 确保目录存在
  await ensureDir(dateDir);

  // 生成文件名
  const filename = generateUniqueFileName(originalName);
  const filePath = path.join(dateDir, filename);
  
  // 生成URL（相对于public目录）
  const relativeDir = getDateBasedDir(type === 'image' ? 'uploads' : 'thumbnails', date);
  const url = `/${relativeDir.replace(/\\/g, '/')}/${filename}`;

  return { url, filePath };
}

/**
 * 确保上传目录存在
 */
export async function ensureUploadDir(): Promise<void> {
  try {
    await fs.access(BASE_UPLOAD_DIR);
  } catch {
    await fs.mkdir(BASE_UPLOAD_DIR, { recursive: true });
    console.log(`Created upload directory: ${BASE_UPLOAD_DIR}`);
  }
}

/**
 * 生成唯一的文件名
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(originalName);
  return `${timestamp}-${random}${ext}`;
}

/**
 * 获取上传目录的绝对路径
 */
export function getUploadDir(): string {
  return BASE_UPLOAD_DIR;
}

/**
 * 获取缩略图目录的绝对路径
 */
export function getThumbnailDir(): string {
  return BASE_THUMBNAIL_DIR;
}
