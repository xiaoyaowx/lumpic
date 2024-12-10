import { NextResponse } from 'next/server';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = join(process.cwd(), 'public', ...params.path);
    
    // 检查文件是否存在
    if (!existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    // 读取文件
    const file = await readFile(filePath);
    
    // 获取文件扩展名
    const ext = filePath.split('.').pop()?.toLowerCase();
    
    // 设置正确的 Content-Type
    const contentType = ext === 'jpg' || ext === 'jpeg' 
      ? 'image/jpeg'
      : ext === 'png'
      ? 'image/png'
      : ext === 'gif'
      ? 'image/gif'
      : ext === 'webp'
      ? 'image/webp'
      : 'application/octet-stream';

    // 返回文件内容
    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error serving static file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
