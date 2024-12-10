import { Session } from 'next-auth';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAdmin(session: Session | null): boolean {
  //log输出当前用户的信息
  console.log('当前用户的信息:', session?.user);
  return session?.user?.role === 'ADMIN';
}

export function requireAdmin(session: Session | null): void {
  if (!isAdmin(session)) {
    throw new Error('Unauthorized: Admin access required');
  }
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
